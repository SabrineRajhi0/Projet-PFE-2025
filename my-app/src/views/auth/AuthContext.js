import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define logout function first to avoid the "used before defined" error
  const logout = useCallback(async () => {
    try {
      // Try to notify the server about logout
      if (user?.accessToken) {
        await axios.post('http://localhost:8087/auth/logout', {}, { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        }).catch(e => console.log('Logout API error (non-critical):', e));
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Clear user state
      setUser(null);
      
      // Clear both local and session storage
      ['accessToken', 'refreshToken', 'user'].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }
  }, [user]);

  // Check if token is expired
  const isTokenExpired = useCallback((token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // If we can't decode it, consider it expired
    }
  }, []);

  // Refresh token function
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token available');
      return null;
    }

    // Don't attempt to refresh with an expired refresh token
    if (isTokenExpired(refreshToken)) {
      console.error('Refresh token is expired');
      // Clear tokens and force re-login
      ['accessToken', 'refreshToken', 'user'].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      return null;
    }

    try {
      console.log('Attempting to refresh access token...');
      const response = await axios.post(
        'http://localhost:8087/auth/refresh',
        { refreshToken },
        { withCredentials: true }
      );
      
      const { accessToken } = response.data;
      console.log('Token refreshed successfully');
      
      // Update token in both storages to ensure consistency
      localStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('accessToken', accessToken);
      
      return accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }, [isTokenExpired]);

  // Setup axios interceptor to automatically handle token refresh
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (!config.url.includes('/auth/login') && !config.url.includes('/auth/refresh')) {
          const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
          
          if (accessToken) {
            // Check if token is expired before using it
            if (isTokenExpired(accessToken)) {
              console.log('Access token expired, attempting refresh...');
              const newToken = await refreshAccessToken();
              
              if (newToken) {
                config.headers.Authorization = `Bearer ${newToken}`;
              } else {
                // If refresh fails, force logout
                toast.error('Session expirée. Veuillez vous reconnecter.');
                logout();
                throw new Error('Session expired');
              }
            } else {
              config.headers.Authorization = `Bearer ${accessToken}`;
            }
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle 401 responses
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Don't retry if we're already trying to refresh the token or login
        if (error.response?.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url.includes('/auth/refresh') &&
            !originalRequest.url.includes('/auth/login')) {
          
          originalRequest._retry = true; // Mark request as retried
          
          try {
            const newToken = await refreshAccessToken();
            if (newToken) {
              // Update the failed request with new token and retry
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error('Failed to refresh token on 401:', refreshError);
          }
          
          // If we reach here, the refresh failed
          toast.error('Session expirée. Veuillez vous reconnecter.');
          logout();
        }
        
        return Promise.reject(error);
      }
    );

    // Cleanup function
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken, isTokenExpired, logout]);
  
  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
        const storedUserStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!accessToken || !refreshToken || !storedUserStr) {
          setLoading(false);
          return;
        }

        // Parse stored user info
        const parsedUser = JSON.parse(storedUserStr);
        // Set initial user from storage
        setUser({
          email: parsedUser.email,
          roles: parsedUser.roles,
          accessToken: accessToken,
          refreshToken: refreshToken
        });

        let currentAccessToken = accessToken;
        // Refresh access token if expired
        if (isTokenExpired(accessToken)) {
          const newToken = await refreshAccessToken();
          if (!newToken) {
            ['accessToken','refreshToken','user'].forEach(key => {
              localStorage.removeItem(key);
              sessionStorage.removeItem(key);
            });
            setUser(null);
            setLoading(false);
            return;
          }
          currentAccessToken = newToken;
          // Update user state with new token
          setUser(prev => prev ? { ...prev, accessToken: newToken } : null);
        }

        // Validate token with backend
        try {
          const response = await axios.get('http://localhost:8087/auth/validate', {
            headers: { Authorization: `Bearer ${currentAccessToken}` },
            withCredentials: true,
          });
          const { email, roles } = response.data;
          setUser({
            email,
            roles,
            accessToken: currentAccessToken,
            refreshToken
          });
        } catch (valError) {
          console.error('Token validation failed:', valError);
          ['accessToken','refreshToken','user'].forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
          });
          setUser(null);
        }
      } catch (e) {
        console.error('Error during auth initialization:', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isTokenExpired, refreshAccessToken]);

  const login = async (email, motdepasse) => {
    try {
      console.log('Attempting login...');
      const response = await axios.post(
        'http://localhost:8087/auth/login',
        { email, password: motdepasse },
        { withCredentials: true }
      );
      
      const { roles, email: userEmail, accessToken, refreshToken } = response.data;
      console.log('Login successful, storing tokens...');

      // Store tokens in both local and session storage for consistency
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({ email: userEmail, roles }));
      
      // Also set in sessionStorage for additional resiliency
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      sessionStorage.setItem('user', JSON.stringify({ email: userEmail, roles }));

      // Update user state
      const userData = { email: userEmail, roles, accessToken, refreshToken };
      setUser(userData);

      return {
        accessToken,
        refreshToken,
        isActive: true,
        roles,
        user: { email: userEmail },
      };
    } catch (error) {
      console.error('Login error:', error);
      // Provide clearer message for 401 Unauthorized
      const status = error.response?.status;
      const message = status === 401
        ? 'Identifiants invalides'
        : error.response?.data?.message || 'Erreur lors de la connexion';
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      refreshAccessToken,
      isTokenExpired
    }}>
      {children}
    </AuthContext.Provider>
  );
};
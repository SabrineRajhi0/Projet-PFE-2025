import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiClient = axios.create({
  baseURL: "http://localhost:8087",
  withCredentials: true,
});

// Function to check if token is expired
const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't decode it, consider it expired
  }
};

// Fonction pour configurer l'intercepteur avec une fonction de navigation
export const configureApiClient = (navigate, refreshTokenCallback) => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
        
        if (refreshToken && !isTokenExpired(refreshToken)) {
          try {
            // Call the API to renew the token
            const response = await apiClient.post("/auth/refresh", { refreshToken });
            const newToken = response.data.accessToken;
            
            // Update token in storages
            localStorage.setItem("accessToken", newToken);
            sessionStorage.setItem("accessToken", newToken);
            
            if (refreshTokenCallback) {
              refreshTokenCallback(newToken);
            }
            
            // Retry the original request
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(error.config);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            navigate("/auth/login");
            return Promise.reject(refreshError);
          }
        } else {
          // No valid refresh token, redirect to login
          navigate("/auth/login");
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;

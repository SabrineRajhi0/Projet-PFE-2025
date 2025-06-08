import React, { useEffect, useRef, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress, Box } from "@mui/material";
import { AuthContext } from "./AuthContext";

const ProtectedLayout = ({ requiredRole, children }) => {
  const navigate = useNavigate();
  const { user, loading, logout, isTokenExpired, refreshAccessToken } = useContext(AuthContext);
  const inactivityTimeoutRef = useRef(null);
  const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes in milliseconds

  // While auth is initializing, show loading indicator
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Determine authentication status
  const isAuthenticated = !!user && !!user.accessToken;

  // Check if user has the required role
  const hasRequiredRole = isAuthenticated && (!requiredRole ||
    (user.roles && Array.isArray(user.roles) && user.roles.includes(requiredRole)));

  // Function to handle logout
  const onLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      toast.info("Session expirée en raison d'une inactivité. Veuillez vous reconnecter.");
      onLogout();
    }, INACTIVITY_LIMIT);
  };

  // Token verification and inactivity tracking
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return;
    }

    const validateAndSetupSession = async () => {
      try {
        // Verify token validity
        if (isTokenExpired(user.accessToken)) {
          console.log("Access token expired, attempting refresh...");
          // Try to refresh the token
          const newToken = await refreshAccessToken();
          if (!newToken) {
            toast.error("Votre session a expiré. Veuillez vous reconnecter.");
            onLogout();
          }
        }

        // Set up activity tracking regardless of refresh result
        // as long as we have a valid session
        const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];
        events.forEach(event => {
          window.addEventListener(event, resetInactivityTimer);
        });
        resetInactivityTimer();

        // Cleanup function
        return () => {
          events.forEach(event => {
            window.removeEventListener(event, resetInactivityTimer);
          });
          if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
          }
        };
      } catch (error) {
        console.error("Error validating session:", error);
        toast.error("Une erreur s'est produite lors de la validation de votre session.");
        onLogout();
      }
    };

    validateAndSetupSession();
  }, [isAuthenticated, user, isTokenExpired, refreshAccessToken, onLogout]);

  // Redirection if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirection if the required role is not present
  if (requiredRole && !hasRequiredRole) {
    toast.error("Accès non autorisé. Vous n'avez pas les permissions nécessaires.");
    setTimeout(() => {
      navigate("/"); // Redirect to home page
    }, 100);
    return null;
  }

  // Render children if everything is valid
  return children;
};

export default ProtectedLayout;
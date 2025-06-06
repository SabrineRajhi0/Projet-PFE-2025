import React, { useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import React from 'react';


const ProtectedLayout = ({ requiredRole, children }) => {
  const navigate = useNavigate();
  const token =
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  let isAuthenticated = false;
  let hasRequiredRole = false;
  const inactivityTimeoutRef = useRef(null); // Référence pour le minuteur
  const INACTIVITY_LIMIT = 15* 60 * 1000; // 15 minutes en millisecondes

  // Fonction de déconnexion
  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    toast.info("Session expirée en raison d'une inactivité. Veuillez vous reconnecter.");
    return <Navigate to="/login" replace />;
  };

  // Réinitialiser le minuteur d'inactivité
  const resetInactivityTimer = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current); // Effacer l'ancien minuteur
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      onLogout(); // Déconnexion après inactivité
    }, INACTIVITY_LIMIT);
  };

  // Vérification du token
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      const expirationTime = decodedToken.exp * 1000;
      const userRoles = decodedToken.roles || decodedToken.authorities || [];

      if (expirationTime >= Date.now()) {
        isAuthenticated = true;

        if (requiredRole) {
          hasRequiredRole = Array.isArray(userRoles)
            ? userRoles.includes(requiredRole)
            : userRoles === requiredRole;
        } else {
          hasRequiredRole = true;
        }
      }
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      toast.error("Token invalide. Veuillez vous reconnecter.");
    }
  }

  // Gérer l'inactivité avec useEffect
  useEffect(() => {
    if (!isAuthenticated) {
      return onLogout();
    }

    // Ajouter des écouteurs d'événements pour détecter l'activité
    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Lancer le minuteur au chargement
    resetInactivityTimer();

    // Nettoyer les écouteurs et le minuteur lors du démontage
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [isAuthenticated]);

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirection si le rôle requis n'est pas présent
  if (!hasRequiredRole) {
    toast.error("Accès non autorisé. Vous n'avez pas les permissions nécessaires.");
    setTimeout(() => {
      navigate("/"); // Rediriger vers la page d'accueil
    }, 100);
    return null;
  }

  // Rendre les enfants si tout est valide
  return children;
};

export default ProtectedLayout;
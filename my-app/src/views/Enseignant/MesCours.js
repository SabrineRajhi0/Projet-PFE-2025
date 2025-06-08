import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardCours from "components/Cards/CardCours.js";
import "../../assets/styles/courseManagement.css";

export default function ListeCours() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors du parsing JSON :", error);
      }
    } else {
      navigate("/auth/login"); // Redirection si pas connecté
    }
  }, [navigate]);

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="course-container">
      <div className="course-card">
        <div className="course-header">
          <h2 className="course-title">Espace Cours</h2>
        </div>

        <div className="course-content">
          <div className="course-grid">
            <CardCours />
          </div>
        </div>
      </div>
    </div>
  );
}

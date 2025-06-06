import React from "react";
import CardListCours from "components/Cards/CardListCours.js";
import "../../assets/styles/courseManagement.css";

export default function ListCours() {
  return (
    <div className="course-container">
      <div className="course-card">
        <div className="course-header">
          <h2 className="course-title">Liste des Cours</h2>
          <p className="course-subtitle">
            Consultez et gérez tous les cours disponibles
          </p>
        </div>

        <div className="course-content">
          <div className="course-grid">
            <div className="w-full lg:w-8/12">
              <CardListCours />
            </div>
            <div className="w-full lg:w-4/12">
              <CardListCours />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

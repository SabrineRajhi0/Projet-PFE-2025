import React from "react";
import CardSettings from "components/Cards/CardSettings.js";
import CardProfile from "components/Cards/CardProfile.js";
import "../../assets/styles/courseManagement.css";

export default function AjouterCours() {
  return (
    <div className="course-container">
      <div className="course-card">
        <div className="course-header">
          <h2 className="course-title">Gérer les Cours</h2>
          <p className="course-subtitle">Configurez et personnalisez vos cours</p>
        </div>

        <div className="course-content">
          <div className="course-grid">
            <div className="w-full lg:w-8/12">
              <CardSettings />
            </div>
            <div className="w-full lg:w-4/12">
              <CardProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

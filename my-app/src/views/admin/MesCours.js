import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardCours from "components/Cards/CardCours.js"; // Reverted: Original import
// import CardListCours from "components/Cards/CardListCours.js"; // Commented out corrected import name
import "../../assets/styles/courseManagement.css";

export default function ListeCours() { // Component name is ListeCours, but it's /admin/MesCours route
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

  // Determine the role to pass. For an admin section, this should be 'admin'.
  // If user object has a role property, use that, otherwise default to 'admin' for this admin page.
  // const roleToPass = user?.role || 'admin'; // Reverted
  // console.log(`[MesCours - Admin View] Passing userRole: ${roleToPass} to CardListCours. User object:`, user); // Reverted

  return (
    <div className="course-container">
      <div className="course-card">
        <div className="course-header">
          {/* <h2 className="course-title">Espace Cours (Admin)</h2> */}
          <h2 className="course-title">Espace Cours</h2> {/* Reverted title */}
        </div>

        <div className="course-content">
          <div className="course-grid">
            <CardCours /> {/* Reverted to original component */}
            {/* <CardListCours userRoleFromProp={roleToPass} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors du parsing JSON:", error);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const getNormalizedRole = (roles) => {
    if (!roles || !Array.isArray(roles)) return null;
    if (roles.includes('ROLE_ADMIN')) return 'admin';
    if (roles.includes('ROLE_ENSEIGNANT')) return 'enseignant';
    if (roles.includes('ROLE_APPRENANT')) return 'apprenant';
    return null;
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  const userRole = getNormalizedRole(user.roles);

  return (
    <>
      {/* Main content only, sidebar is handled by Admin layout */}
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Bienvenue, {user.email}!</h1>
        </div>

        <div className="dashboard-content">
          {userRole === 'admin' && (
            <div>
              <h2>Tableau de bord Administrateur</h2>
              <div>
                <h3>Gestion des Utilisateurs</h3>
                <button className="action-btn">Voir tous les utilisateurs</button>
              </div>
              <div>
                <h3>Gestion des cours</h3>
                <ul className="sous-menu">
                  <li><button onClick={() => navigate('/niveau')}>Niveaux</button></li>
                  <li><button onClick={() => navigate('/chapitre')}>Chapitres</button></li>
                  <li><button onClick={() => navigate('/courslist', { state: { userRole } })}>Cours liste</button></li>
                  <li><button onClick={() => navigate('/cours')}>Edit cours</button></li>
                </ul>
              </div>
              <div>
                <h3>Rapports Système</h3>
                <button className="action-btn">Générer un rapport</button>
              </div>
            </div>
          )}

          {userRole === 'enseignant' && (
            <div>
              <h2>Tableau de bord Enseignant</h2>
              <div>
                <h3>Mes Cours</h3>
                <li>
                  <button
                    className="action-btn"
                    onClick={() => navigate('/courslist', { state: { userRole } })}
                  >
                    Gestion cours
                  </button>
                </li>
              </div>
              <div>
                <h3>Notes des Étudiants</h3>
                <button className="action-btn">Gérer les notes</button>
              </div>
            </div>
          )}

          {userRole === 'apprenant' && (
            <div>
              <h2>Tableau de bord Étudiant</h2>
              <div>
                <h3>Mes Cours</h3>
                <button className="action-btn">Voir mes cours</button>
              </div>
              <div>
                <h3>Mes Notes</h3>
                <button className="action-btn">Voir mes notes</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

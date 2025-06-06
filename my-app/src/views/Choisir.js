import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Choisir() {
  const [niveauxChapitres, setNiveauxChapitres] = useState([]);
  const [selectedNiveau, setSelectedNiveau] = useState(null);
  const [selectedChapitre, setSelectedChapitre] = useState(null);
  const [showNiveaux, setShowNiveaux] = useState(false);
  const navigate = useNavigate();



  // Fetch data from the backend
  useEffect(() => {
    fetch('http://localhost:8087/api/choisir/niveaux-chapitres')
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data);
        setNiveauxChapitres(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);



  // Handle showing the list of niveaux
  const handleNiveauClick = () => {
    setShowNiveaux(!showNiveaux);
  };

  // Handle selecting a niveau
  const handleSelectNiveau = (niveau) => {
    console.log('Selected Niveau:', niveau);
    setSelectedNiveau(niveau);
    setSelectedChapitre(null); // Réinitialise le chapitre
    setShowNiveaux(false);
  };

  // Handle selecting a chapitre
  const handleSelectChapitre = (chapitre) => {
    console.log('Selected Chapitre:', chapitre);
    if (chapitre && chapitre.nomchap) {
      setSelectedChapitre(chapitre);
    } else {
      console.log('Chapitre invalide ou sans titre, non sélectionné.');
      setSelectedChapitre(null);
    }
  };

  const handleEnvoyer = () => {
    if (selectedNiveau && selectedChapitre && selectedChapitre.nomchap) {
      console.log(`Niveau sélectionné: ${selectedNiveau.niveau.nom}, Chapitre sélectionné: ${selectedChapitre.nomchap}`);
      // Naviguer vers la page du test ou du cours
      navigate('/test');
    } else {
      alert("Veuillez sélectionner un niveau et un chapitre avec un titre valide.");
    }
  };

  // Handle "Annuler" button
  const handleAnnuler = () => {
    navigate('/');
  };

  useEffect(() => {
  const savedNiveau = localStorage.getItem('niveau');
  const savedChapitre = localStorage.getItem('chapitre');
  if (savedNiveau) setSelectedNiveau(JSON.parse(savedNiveau));
  if (savedChapitre) setSelectedChapitre(JSON.parse(savedChapitre));
}, []);

useEffect(() => {
  localStorage.setItem('niveau', JSON.stringify(selectedNiveau));
}, [selectedNiveau]);

useEffect(() => {
  localStorage.setItem('chapitre', JSON.stringify(selectedChapitre));
}, [selectedChapitre]);


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #001233, #023e7d)',
      color: 'white',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header avec titre et description */}
      <header style={{ textAlign: 'center', marginBottom: '40px', padding: '20px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          background: 'linear-gradient(90deg, #00CED1, #0077B6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Gestion du cours basée sur l'IA
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          maxWidth: '600px', 
          margin: '0 auto',
          color: '#caf0f8'
        }}>
          Conçue pour les élèves de 1ère, 2ème, 3ème année secondaire ainsi que pour 4ème année, 
          elle offre un accès intelligent, structuré et personnalisé aux cours de physique.
        </p>
      </header>

      <div style={{ 
        flex: 1, 
        maxWidth: '800px', 
        margin: '0 auto',
        background: 'rgba(1, 33, 56, 0.7)',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0, 82, 147, 0.3)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(0, 206, 209, 0.2)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '2rem',
          fontWeight: '600',
          color: '#90e0ef'
        }}>
          Choisir votre cours
        </h1>

        {/* Niveau Section */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{
              width: '10px',
              height: '30px',
              background: 'linear-gradient(180deg, #00CED1, #0077B6)',
              marginRight: '10px',
              borderRadius: '3px'
            }}></div>
            <h3 
              style={{ 
                cursor: 'pointer', 
                color: '#90e0ef',
                fontSize: '1.3rem',
                fontWeight: '500'
              }} 
              onClick={handleNiveauClick}
            >
              Sélectionnez votre niveau
            </h3>
          </div>
          
          {showNiveaux && (
            <div style={{ 
              border: '1px solid rgba(0, 206, 209, 0.3)', 
              padding: '15px', 
              backgroundColor: 'rgba(0, 53, 102, 0.5)',
              borderRadius: '8px',
              marginTop: '10px'
            }}>
              {niveauxChapitres.length > 0 ? (
                niveauxChapitres.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectNiveau(item)}
                    style={{
                      cursor: 'pointer',
                      padding: '12px',
                      margin: '5px 0',
                      borderRadius: '6px',
                      background: selectedNiveau?.niveau?.nom === item.niveau.nom 
                        ? 'linear-gradient(90deg, rgba(0, 206, 209, 0.3), rgba(0, 119, 182, 0.3))' 
                        : 'rgba(0, 53, 102, 0.3)',
                      border: '1px solid rgba(0, 206, 209, 0.2)',
                      transition: 'all 0.3s ease',
                      ':hover': {
                        background: 'linear-gradient(90deg, rgba(0, 206, 209, 0.4), rgba(0, 119, 182, 0.4))'
                      }
                    }}
                  >
                    {item.niveau.nom}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#caf0f8' }}>Aucun niveau disponible.</p>
              )}
            </div>
          )}
          
          {selectedNiveau && !showNiveaux && (
            <div style={{
              background: 'rgba(0, 53, 102, 0.4)',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 206, 209, 0.3)',
              marginTop: '15px'
            }}>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>
                <span style={{ fontWeight: 'bold', color: '#90e0ef' }}>Niveau sélectionné :</span> {selectedNiveau.niveau.nom}
              </p>
            </div>
          )}
        </div>

        {/* Cours Section */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{
              width: '10px',
              height: '30px',
              background: 'linear-gradient(180deg, #00CED1, #0077B6)',
              marginRight: '10px',
              borderRadius: '3px'
            }}></div>
            <h3 style={{ 
              color: '#90e0ef',
              fontSize: '1.3rem',
              fontWeight: '500'
            }}>
              Choisissez votre cours
            </h3>
          </div>
          
          {selectedNiveau ? (
            <div>
              {selectedNiveau.chapitres && Array.isArray(selectedNiveau.chapitres) && selectedNiveau.chapitres.length > 0 ? (
                <div style={{ 
                  border: '1px solid rgba(0, 206, 209, 0.3)', 
                  padding: '15px', 
                  backgroundColor: 'rgba(0, 53, 102, 0.5)',
                  borderRadius: '8px'
                }}>
                  {selectedNiveau.chapitres.map((chapitre, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectChapitre(chapitre)}
                      style={{
                        cursor: 'pointer',
                        padding: '12px',
                        margin: '8px 0',
                        borderRadius: '6px',
                        background: selectedChapitre?.nomchap === chapitre.nomchap
                          ? 'linear-gradient(90deg, rgba(0, 206, 209, 0.3), rgba(0, 119, 182, 0.3))' 
                          : 'rgba(0, 53, 102, 0.3)',
                        border: '1px solid rgba(0, 206, 209, 0.2)',
                        transition: 'all 0.3s ease',
                        ':hover': {
                          background: 'linear-gradient(90deg, rgba(0, 206, 209, 0.4), rgba(0, 119, 182, 0.4))'
                        }
                      }}
                    >
                      {chapitre.nomchap || 'Chapitre sans titre'}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#caf0f8' }}>Aucun cours disponible pour ce niveau.</p>
              )}
            </div>
          ) : (
            <p style={{ 
              textAlign: 'center', 
              padding: '20px', 
              background: 'rgba(0, 53, 102, 0.4)',
              borderRadius: '8px',
              border: '1px dashed rgba(0, 206, 209, 0.3)'
            }}>
              Veuillez sélectionner un niveau pour voir les cours.
            </p>
          )}
          
          {selectedChapitre && (
            <div style={{
              background: 'rgba(0, 53, 102, 0.4)',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 206, 209, 0.3)',
              marginTop: '15px'
            }}>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>
                <span style={{ fontWeight: 'bold', color: '#90e0ef' }}>Cours sélectionné :</span> {selectedChapitre.nomchap || 'Chapitre sans titre'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Boutons en bas de page */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '30px', 
        padding: '30px 10px',
        marginTop: '20px'
      }}>
        <button 
          onClick={handleEnvoyer} 
          style={{ 
            background: 'linear-gradient(90deg, #00B4D8, #0077B6)',
            color: 'white', 
            padding: '14px 30px', 
            border: 'none', 
            borderRadius: '30px', 
            cursor: 'pointer', 
            minWidth: '180px',
            fontSize: '1.1rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0, 180, 216, 0.4)',
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 20px rgba(0, 180, 216, 0.6)'
            }
          }}
        >
          PASSER AU TEST
        </button>
        <button 
          onClick={handleAnnuler} 
          style={{ 
            background: 'rgba(202, 240, 248, 0.1)',
            color: '#caf0f8', 
            padding: '14px 30px', 
            border: '1px solid rgba(202, 240, 248, 0.4)', 
            borderRadius: '30px', 
            cursor: 'pointer', 
            minWidth: '180px',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            ':hover': {
              background: 'rgba(202, 240, 248, 0.2)',
              transform: 'translateY(-3px)'
            }
          }}
        >
          Annuler
        </button>
      </div>
      
      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: '#90e0ef',
        fontSize: '0.9rem',
        marginTop: 'auto'
      }}>
        © 2025 Plateforme IA Éducative | Tous droits réservés
      </footer>
    </div>
  );
}

export default Choisir;
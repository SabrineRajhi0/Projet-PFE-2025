import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function Choisir() {
  const [niveauxChapitres, setNiveauxChapitres] = useState([]);
  const [selectedNiveau, setSelectedNiveau] = useState(null);
  const [selectedChapitre, setSelectedChapitre] = useState(null);
  const [showNiveaux, setShowNiveaux] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const navigate = useNavigate();

  // Fetch data from the backend
  useEffect(() => {
    fetch("http://localhost:8087/api/choisir/niveaux-chapitres")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        setNiveauxChapitres(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle showing the list of niveaux
  const handleNiveauClick = () => {
    setShowNiveaux(!showNiveaux);
  };

  // Handle selecting a niveau
  const handleSelectNiveau = (niveau) => {
    console.log("Selected Niveau:", niveau);
    setSelectedNiveau(niveau);
    setSelectedChapitre(null); // Réinitialise le chapitre
    setShowNiveaux(false);
  };

  // Handle selecting a chapitre
  const handleSelectChapitre = (chapitre) => {
    console.log("Selected Chapitre:", chapitre);
    if (chapitre && chapitre.nomchap) {
      setSelectedChapitre(chapitre);
    } else {
      console.log("Chapitre invalide ou sans titre, non sélectionné.");
      setSelectedChapitre(null);
    }
  };
  const fetchElementByidespac = async (idespac) => {
    try {
      const response = await axios.get(
        `http://localhost:8087/api/element/v1/getByEspaceCoursId/${idespac}`
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.status === 404
          ? `Aucun élément de cours trouvé pour l'ID ${idespac}. Veuillez vérifier que le cours contient des fichiers.`
          : err.response?.status === 400
          ? "Élément introuvable ou erreur serveur."
          : err.message;
      throw new Error(message);
    }
  };
  const genererQuizDepuisPDF = async (cheminElt) => {
    try {
      setLoadingMessage("Préparation du fichier...");
      setLoadingProgress(10);

      const fileUrl = `http://localhost:8087/${cheminElt}`;
      const fileResponse = await fetch(fileUrl);

      if (!fileResponse.ok) {
        throw new Error(
          "Échec du téléchargement du fichier depuis le backend Spring"
        );
      }

      setLoadingMessage("Chargement du contenu...");
      setLoadingProgress(30);

      const blob = await fileResponse.blob();

      // Préparer FormData
      const formData = new FormData();
      formData.append("file", blob, "cours.pdf");

      setLoadingMessage("Analyse par l'IA en cours...");
      setLoadingProgress(60);

      // Appeler ton backend Flask ou directement Together API (exemple Flask ici)
      const response = await fetch("http://localhost:5001/generate-quiz", {
        method: "POST",
        body: formData,
      });

      setLoadingMessage("Traitement de la réponse...");
      setLoadingProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erreur serveur: ${response.status} - ${
            errorData.error || "Erreur inconnue"
          }`
        );
      }

      const result = await response.json();
      setLoadingMessage("Finalisation du quiz...");
      setLoadingProgress(90);

      return result.quiz;
    } catch (err) {
      console.error("Erreur :", err.message);
      Swal.fire("Erreur", err.message, "error");
      throw err;
    } finally {
      setLoadingProgress(100);
    }
  };
  const handleEnvoyer = async () => {
    if (selectedNiveau && selectedChapitre && selectedChapitre.nomchap) {
      try {
        setIsLoading(true);
        setLoadingProgress(0);
        setLoadingMessage("Initialisation...");
        console.log(
          "Fetching elements for chapter ID:",
          selectedChapitre.espaceCours.idespac
        );
        const response = await fetchElementByidespac(
          selectedChapitre.espaceCours.idespac
        );

        console.log("Backend response:", response);

        // Ensure we have an array to work with
        const elements = Array.isArray(response) ? response : [response];

        if (!elements || elements.length === 0) {
          throw new Error("Aucun élément trouvé pour ce chapitre.");
        }

        // Find the first PDF element
        const pdfElement = elements.find(
          (element) =>
            element &&
            element.cheminElt &&
            typeof element.cheminElt === "string" &&
            element.cheminElt.toLowerCase().endsWith(".pdf")
        );

        if (pdfElement?.cheminElt) {
          console.log("Found PDF file:", pdfElement.cheminElt);
          const quiz = await genererQuizDepuisPDF(pdfElement.cheminElt);
          if (quiz) {
            navigate("/quiz", { state: { quiz } });
          }
        } else {
          Swal.fire(
            "Fichier PDF introuvable",
            "Aucun fichier PDF n'a été trouvé pour ce chapitre. Veuillez choisir un autre chapitre.",
            "warning"
          );
        }
      } catch (err) {
        // Ne pas afficher à nouveau si SweetAlert a déjà été affiché
        if (!err.message.includes("SweetAlert")) {
          Swal.fire("Erreur", err.message, "error");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      alert(
        "Veuillez sélectionner un niveau et un chapitre avec un titre valide."
      );
    }
  };

  // Handle "Annuler" button
  const handleAnnuler = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #001233, #023e7d)",
        color: "white",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 18, 51, 0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              marginBottom: "30px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                border: "8px solid transparent",
                borderTopColor: "#00CED1",
                borderRightColor: "#0077B6",
                borderRadius: "50%",
                animation: "spin 1.5s linear infinite",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                width: "70%",
                height: "70%",
                top: "15%",
                left: "15%",
                border: "6px solid transparent",
                borderBottomColor: "#90E0EF",
                borderLeftColor: "#CAF0F8",
                borderRadius: "50%",
                animation: "spinReverse 1s linear infinite",
              }}
            ></div>
          </div>

          <h3
            style={{
              color: "#90E0EF",
              fontSize: "1.5rem",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Génération du quiz en cours
          </h3>

          <p
            style={{
              color: "#CAF0F8",
              fontSize: "1rem",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            {loadingMessage}
          </p>

          <div
            style={{
              width: "60%",
              maxWidth: "400px",
              height: "8px",
              backgroundColor: "rgba(202, 240, 248, 0.2)",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: `${loadingProgress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #00B4D8, #0077B6)",
                transition: "width 0.3s ease",
                borderRadius: "4px",
              }}
            ></div>
          </div>

          <span
            style={{
              color: "#90E0EF",
              fontSize: "0.9rem",
            }}
          >
            {loadingProgress}% complété
          </span>
        </div>
      )}

      {/* Rest of your existing JSX remains the same */}
      {/* Header avec titre et description */}
      <header
        style={{ textAlign: "center", marginBottom: "40px", padding: "20px" }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "10px",
            background: "linear-gradient(90deg, #00CED1, #0077B6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Gestion du cours basée sur l'IA
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            maxWidth: "600px",
            margin: "0 auto",
            color: "#caf0f8",
          }}
        >
          Conçue pour les élèves de 1ère, 2ème, 3ème année secondaire ainsi que
          pour 4ème année, elle offre un accès intelligent, structuré et
          personnalisé aux cours de physique.
        </p>
      </header>

      <div
        style={{
          flex: 1,
          maxWidth: "800px",
          margin: "0 auto",
          background: "rgba(1, 33, 56, 0.7)",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 8px 32px rgba(0, 82, 147, 0.3)",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(0, 206, 209, 0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "2rem",
            fontWeight: "600",
            color: "#90e0ef",
          }}
        >
          Choisir votre cours
        </h1>

        {/* Niveau Section */}
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "30px",
                background: "linear-gradient(180deg, #00CED1, #0077B6)",
                marginRight: "10px",
                borderRadius: "3px",
              }}
            ></div>
            <h3
              style={{
                cursor: "pointer",
                color: "#90e0ef",
                fontSize: "1.3rem",
                fontWeight: "500",
              }}
              onClick={handleNiveauClick}
            >
              Sélectionnez votre niveau
            </h3>
          </div>

          {showNiveaux && (
            <div
              style={{
                border: "1px solid rgba(0, 206, 209, 0.3)",
                padding: "15px",
                backgroundColor: "rgba(0, 53, 102, 0.5)",
                borderRadius: "8px",
                marginTop: "10px",
              }}
            >
              {niveauxChapitres.length > 0 ? (
                niveauxChapitres.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectNiveau(item)}
                    style={{
                      cursor: "pointer",
                      padding: "12px",
                      margin: "5px 0",
                      borderRadius: "6px",
                      background:
                        selectedNiveau?.niveau?.nom === item.niveau.nom
                          ? "linear-gradient(90deg, rgba(0, 206, 209, 0.3), rgba(0, 119, 182, 0.3))"
                          : "rgba(0, 53, 102, 0.3)",
                      border: "1px solid rgba(0, 206, 209, 0.2)",
                      transition: "all 0.3s ease",
                      ":hover": {
                        background:
                          "linear-gradient(90deg, rgba(0, 206, 209, 0.4), rgba(0, 119, 182, 0.4))",
                      },
                    }}
                  >
                    {item.niveau.nom}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#caf0f8" }}>
                  Aucun niveau disponible.
                </p>
              )}
            </div>
          )}

          {selectedNiveau && !showNiveaux && (
            <div
              style={{
                background: "rgba(0, 53, 102, 0.4)",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid rgba(0, 206, 209, 0.3)",
                marginTop: "15px",
              }}
            >
              <p style={{ margin: 0, fontSize: "1.1rem" }}>
                <span style={{ fontWeight: "bold", color: "#90e0ef" }}>
                  Niveau sélectionné :
                </span>{" "}
                {selectedNiveau.niveau.nom}
              </p>
            </div>
          )}
        </div>

        {/* Cours Section */}
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "30px",
                background: "linear-gradient(180deg, #00CED1, #0077B6)",
                marginRight: "10px",
                borderRadius: "3px",
              }}
            ></div>
            <h3
              style={{
                color: "#90e0ef",
                fontSize: "1.3rem",
                fontWeight: "500",
              }}
            >
              Choisissez votre cours
            </h3>
          </div>

          {selectedNiveau ? (
            <div>
              {selectedNiveau.chapitres &&
              Array.isArray(selectedNiveau.chapitres) &&
              selectedNiveau.chapitres.length > 0 ? (
                <div
                  style={{
                    border: "1px solid rgba(0, 206, 209, 0.3)",
                    padding: "15px",
                    backgroundColor: "rgba(0, 53, 102, 0.5)",
                    borderRadius: "8px",
                  }}
                >
                  {selectedNiveau.chapitres.map((chapitre, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectChapitre(chapitre)}
                      style={{
                        cursor: "pointer",
                        padding: "12px",
                        margin: "8px 0",
                        borderRadius: "6px",
                        background:
                          selectedChapitre?.nomchap === chapitre.nomchap
                            ? "linear-gradient(90deg, rgba(0, 206, 209, 0.3), rgba(0, 119, 182, 0.3))"
                            : "rgba(0, 53, 102, 0.3)",
                        border: "1px solid rgba(0, 206, 209, 0.2)",
                        transition: "all 0.3s ease",
                        ":hover": {
                          background:
                            "linear-gradient(90deg, rgba(0, 206, 209, 0.4), rgba(0, 119, 182, 0.4))",
                        },
                      }}
                    >
                      {chapitre.nomchap || "Chapitre sans titre"}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: "center", color: "#caf0f8" }}>
                  Aucun cours disponible pour ce niveau.
                </p>
              )}
            </div>
          ) : (
            <p
              style={{
                textAlign: "center",
                padding: "20px",
                background: "rgba(0, 53, 102, 0.4)",
                borderRadius: "8px",
                border: "1px dashed rgba(0, 206, 209, 0.3)",
              }}
            >
              Veuillez sélectionner un niveau pour voir les cours.
            </p>
          )}

          {selectedChapitre && (
            <div
              style={{
                background: "rgba(0, 53, 102, 0.4)",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid rgba(0, 206, 209, 0.3)",
                marginTop: "15px",
              }}
            >
              <p style={{ margin: 0, fontSize: "1.1rem" }}>
                <span style={{ fontWeight: "bold", color: "#90e0ef" }}>
                  Cours sélectionné :
                </span>{" "}
                {selectedChapitre.nomchap || "Chapitre sans titre"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Boutons en bas de page */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          padding: "30px 10px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handleEnvoyer}
          style={{
            background: "linear-gradient(90deg, #00B4D8, #0077B6)",
            color: "white",
            padding: "14px 30px",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            minWidth: "180px",
            fontSize: "1.1rem",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(0, 180, 216, 0.4)",
            transition: "all 0.3s ease",
            ":hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 6px 20px rgba(0, 180, 216, 0.6)",
            },
          }}
        >
          PASSER AU TEST
        </button>
        <button
          onClick={handleAnnuler}
          style={{
            background: "rgba(202, 240, 248, 0.1)",
            color: "#caf0f8",
            padding: "14px 30px",
            border: "1px solid rgba(202, 240, 248, 0.4)",
            borderRadius: "30px",
            cursor: "pointer",
            minWidth: "180px",
            fontSize: "1.1rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            ":hover": {
              background: "rgba(202, 240, 248, 0.2)",
              transform: "translateY(-3px)",
            },
          }}
        >
          Annuler
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#90e0ef",
          fontSize: "0.9rem",
          marginTop: "auto",
        }}
      >
        © 2025 Plateforme IA Éducative | Tous droits réservés
      </footer>
    </div>
  );
}

export default Choisir;
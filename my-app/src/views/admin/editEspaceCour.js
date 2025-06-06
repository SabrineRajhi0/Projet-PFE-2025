import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { elementCoursService } from "../../Services/ElmentcoursService";
import AjouterElementCours from "./AjouterElementCours";
import { toast } from "react-toastify";
import { fileService } from "../../Services/services";
import "../../assets/styles/courseManagement.css";

const ModifierCoursPage = () => {
  const location = useLocation();
  const { idespac } = location.state?.cours || {};
  const [elementsCours, setElementsCours] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [elementSelectionne, setElementSelectionne] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch course elements on mount
  useEffect(() => {
    const fetchElements = async () => {
      if (!idespac) {
        console.warn("No idespac provided");
        setError("ID du cours manquant");
        return;
      }

      console.log("Fetching elements for course ID:", idespac);
      setIsLoading(true);
      setError(null);

      try {
        const data = await elementCoursService.getAllElementCours();
        console.log("Raw API response:", data);
        
        if (!Array.isArray(data)) {
          console.error("API response is not an array:", data);
          setError("Format de données invalide");
          return;
        }

        const filtered = data.filter((ec) => ec.espaceCours?.idespac === idespac);
        console.log("Filtered elements:", filtered);
        
        setElementsCours(filtered);
      } catch (error) {
        console.error("Failed to fetch course elements:", error);
        setError(error.response?.data?.message || "Erreur lors de la récupération des éléments de cours");
        toast.error("Erreur lors de la récupération des éléments de cours");
      } finally {
        setIsLoading(false);
      }
    };

    fetchElements();
  }, [idespac]);

  const handleNavigateToEditelement = (ec) => {
    setElementSelectionne(ec);
    setAfficherFormulaire(true);
  };

  const handleSupprimer = async (idEC) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet élément ?")) return;
    try {
      await elementCoursService.deleteElementCours(idEC);
      setElementsCours(elementsCours.filter((ec) => ec.idEC !== idEC));
      toast.success("Élément supprimé avec succès");
    } catch (error) {
      console.error("Failed to delete element:", error);
      toast.error("Erreur lors de la suppression de l'élément");
    }
  };

  // New handler to display/preview the file
  const handleAfficherFichier = async (ec) => {
    if (!ec.element?.cheminElt) {
      return toast.error("Aucun fichier disponible à afficher");
    }
    const filename = ec.element.cheminElt.split('/').pop();
    const result = await fileService.handleFile(filename);
    if (!result.success) {
      toast.error(`Erreur lors de l'affichage du fichier: ${result.error}`);
    }
  };

  if (!idespac) {
    return <div>Erreur : Aucune donnée de cours reçue.</div>;
  }

  return (
    <div className="course-container">
      <div className="course-card">
        <div className="course-header">
          <h2 className="course-title">
            Modifier Espace Cours ID: {idespac}
          </h2>
          <p className="course-subtitle">
            Gérez les éléments de votre espace de cours
          </p>
        </div>

        <div className="course-content">
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <span className="ml-3 text-gray-600">Chargement des éléments...</span>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : elementsCours.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="empty-state-text">Aucun élément trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par ajouter un nouvel élément au cours.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="course-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ordre</th>
                    <th>Description</th>
                    <th>Visible</th>
                    <th>Type</th>
                    <th>Date Limite</th>
                    <th>Date Ajout</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {elementsCours.map((ec) => (
                    <tr key={ec.idEC}>
                      <td>{ec.idEC}</td>
                      <td>{ec.ordreEC ?? "N/A"}</td>
                      <td>{ec.element?.desElt ?? "N/A"}</td>
                      <td>
                        <span className={`status-badge ${ec.visibleEC ? 'success' : 'error'}`}>
                          {ec.visibleEC ? "Visible" : "Non visible"}
                        </span>
                      </td>
                      <td>{ec.element?.typeElement?.nomTE ?? "N/A"}</td>
                      <td>{ec.dateLimite ? new Date(ec.dateLimite).toLocaleDateString() : "N/A"}</td>
                      <td>{ec.dateAjoutEC ? new Date(ec.dateAjoutEC).toLocaleDateString() : "N/A"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleAfficherFichier(ec)}
                            className="btn btn-secondary"
                            disabled={!ec.element?.cheminElt}
                          >
                            Afficher
                          </button>
                          <button
                            onClick={() => handleNavigateToEditelement(ec)}
                            className="btn btn-primary"
                          >
                            Modifier
                          </button>

                          <button
                            onClick={() => handleSupprimer(ec.idEC)}
                            className="btn btn-danger"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={() => {
              setElementSelectionne(null);
              setAfficherFormulaire(!afficherFormulaire);
            }}
            className="btn btn-success mt-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            {afficherFormulaire ? "Fermer le formulaire" : "Ajouter un élément"}
          </button>
        </div>
      </div>

      {afficherFormulaire && (
        <div className="mt-6">
          <AjouterElementCours
            initialData={elementSelectionne ? {
              idEC: elementSelectionne.idEC,
              visibleEC: elementSelectionne.visibleEC,
              ordreEC: elementSelectionne.ordreEC,
              dateLimite: elementSelectionne.dateLimite?.slice(0, 10),
              idespac: elementSelectionne.espaceCours?.idespac,
              idTE: elementSelectionne.element?.typeElement?.idTE,
              description: elementSelectionne.element?.desElt,
            } : { idespac }}
            onSuccess={() => {
              setAfficherFormulaire(false);
              setElementSelectionne(null);
              elementCoursService.getAllElementCours().then((data) => {
                setElementsCours(data.filter((ec) => ec.espaceCours?.idespac === idespac));
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ModifierCoursPage;
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import EditCourseModal from "components/Cards/EditCourseModal";

const TableDropdown = ({ coursItem, onEdit }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = useRef(null);
  const popoverDropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Récupérer le rôle depuis localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.roles?.includes("ROLE_ADMIN") || false;

  // Gestion de la fermeture du menu déroulant en cliquant à l'extérieur
  const handleClickOutside = (event) => {
    if (
      popoverDropdownRef.current &&
      !popoverDropdownRef.current.contains(event.target) &&
      btnDropdownRef.current &&
      !btnDropdownRef.current.contains(event.target)
    ) {
      setDropdownPopoverShow(false);
    }
  };

  useEffect(() => {
    if (dropdownPopoverShow) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownPopoverShow]);

  // Fonction pour afficher la modale avec une liste statique d'éléments
  const handleOpenModal = () => {
    setDropdownPopoverShow(false); // Ferme le menu déroulant si ouvert

    // Vérifier si l'utilisateur est admin
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.roles?.includes("ROLE_ADMIN") || false;

    // Données statiques pour la liste d'éléments
    const staticElements = [
      {
        date_ajout_ec: "2025-06-01T10:00:00",
        ordreec: 1,
        visibleec: true,
        id_elt: 101,
        id_espc: 201,
        idec: 301,
        date_limite: "2025-06-15T23:59:00",
        cheminElt: "files/maths.pdf",
      },
      {
        date_ajout_ec: "2025-06-02T14:30:00",
        ordreec: 2,
        visibleec: false,
        id_elt: 102,
        id_espc: 202,
        idec: 302,
        date_limite: "2025-06-20T23:59:00",
        cheminElt: null, // Simule un élément sans fichier
      },
      {
        date_ajout_ec: "2025-06-03T09:15:00",
        ordreec: 3,
        visibleec: true,
        id_elt: 103,
        id_espc: 203,
        idec: 303,
        date_limite: "2025-06-25T23:59:00",
        cheminElt: "files/chemistry.pdf",
      },
    ];

    // Filtrer les éléments pour les non-admins (visibleec: true uniquement)
    const filteredElements = isAdmin
      ? staticElements
      : staticElements.filter((element) => element.visibleec);

    // Fonction pour formater les dates
    const formatDate = (date) => {
      if (!date) return "Non défini";
      try {
        const parsedDate = new Date(date);
        return parsedDate.toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "Date invalide";
      }
    };

    // Fonction pour ouvrir l'élément cliqué
    const handleRowClick = (cheminElt) => {
      if (cheminElt) {
        const fileUrl = `http://localhost:8087/${cheminElt}`;
        window.open(fileUrl, "_blank");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Fichier introuvable",
          text: "Le fichier est manquant pour cet élément.",
          confirmButtonColor: "#3085d6",
        });
      }
    };

    // Génération du HTML pour la modale avec un tableau
    const modalContent = `
    <div style="display: flex; flex-direction: column; gap: 1.5rem; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
      <h3 style="margin: 0; font-size: 1.75rem; font-weight: 700; color: #111827;">
        Liste des Éléments
      </h3>
      <div style="overflow-x: auto; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05);">
        <table style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
          <thead>
            <tr style="background-color: #f3f4f6; color: #374151; font-weight: 600; font-size: 0.9rem;">
              <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">Date d'ajout</th>
              <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">Ordre</th>
              <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">Visibilité</th>
              <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">ID Élément</th>
              <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">ID Espace Cours</th>
              <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">ID EC</th>
              <th style="padding: 1rem; text-align: left; border-bottom: 2px solid #e5e7eb;">Date limite</th>
            </tr>
          </thead>
          <tbody>
            ${
              filteredElements.length > 0
                ? filteredElements
                    .map(
                      (element, index) => `
                    <tr 
                      style="cursor: pointer; background-color: ${
                        index % 2 === 0 ? "#fafafa" : "#ffffff"
                      }; transition: background-color 0.2s;"
                      onmouseover="this.style.backgroundColor='#f1f5f9'"
                      onmouseout="this.style.backgroundColor='${
                        index % 2 === 0 ? "#fafafa" : "#ffffff"
                      }'"
                      onclick="Swal.getPopup().dispatchEvent(new CustomEvent('row-click', { detail: '${
                        element.cheminElt || ""
                      }' }))"
                    >
                      <td style="padding: 1rem; color: #111827; font-size: 0.875rem;">${formatDate(
                        element.date_ajout_ec
                      )}</td>
                      <td style="padding: 1rem; color: #111827; font-size: 0.875rem;">${
                        element.ordreec
                      }</td>
                      <td style="padding: 1rem; color: #111827; font-size: 0.875rem;">${
                        element.visibleec ? "Visible" : "Non visible"
                      }</td>
                      <td style="padding: 1rem; color: #111827; font-size: 0.875rem;">${
                        element.id_elt
                      }</td>
                      <td style="padding: 1rem; color: #111827; font-size: 0.875rem;">${
                        element.id_espc
                      }</td>
                      <td style="padding: 1rem; color: #111827; font-size: 0.875rem;">${
                        element.idec
                      }</td>
                      <td style="padding: 1rem; color: #111827; font-size: 0.875rem;">${formatDate(
                        element.date_limite
                      )}</td>
                    </tr>
                  `
                    )
                    .join("")
                : `<tr><td colspan="7" style="padding: 1rem; text-align: center; color: #6b7280;">Aucun élément visible disponible.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>
  `;

    Swal.fire({
      title: "Liste des Éléments",
      html: modalContent,
      confirmButtonText: "Fermer",
      confirmButtonColor: "#2563eb",
      width: "800px",
      customClass: {
        popup: "rounded-xl shadow-xl",
        title: "text-2xl font-bold text-gray-900",
        confirmButton:
          "px-6 py-2 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition-colors",
      },
      didOpen: () => {
        // Ajouter un écouteur d'événements pour les clics sur les lignes
        const popup = Swal.getPopup();
        popup.addEventListener("row-click", (e) => {
          handleRowClick(e.detail);
        });
      },
    });
  };
  const handleEditClick = (course) => {
    setDropdownPopoverShow(false);
    setSelectedCourse(course);

    Swal.fire({
      title: `
        <div class="flex items-center justify-center">
          <i class="fas fa-edit text-2xl text-blue-500 mr-3"></i>
          <span class="text-xl font-bold text-gray-800">Modification du cours</span>
        </div>
      `,
      html: `
        <div class="text-center py-4">
          <p class="text-gray-600 mb-1">Vous êtes sur le point de modifier :</p>
          <p class="text-blue-600 font-semibold text-lg py-2 px-4 bg-blue-50 rounded-lg inline-block">
            ${course.nomespac || "Cours sélectionné"}
          </p>
          <div class="mt-4 text-sm text-gray-500">
            <i class="fas fa-info-circle mr-1"></i>
            Toutes les modifications seront enregistrées dans l'historique
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: `
        <div class="flex items-center">
          <i class="fas fa-check-circle mr-2"></i>
          Confirmer
        </div>
      `,
      cancelButtonText: `
        <div class="flex items-center">
          <i class="fas fa-times-circle mr-2"></i>
          Annuler
        </div>
      `,
      buttonsStyling: false,
      customClass: {
        popup: "animated zoomIn",
        confirmButton: `
          bg-gradient-to-r from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          text-white font-medium py-2 px-6 rounded-lg
          shadow-md hover:shadow-lg
          transition-all duration-200
          transform hover:scale-105
          active:scale-95
          border-none
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        `,
        cancelButton: `
          bg-gradient-to-r from-gray-200 to-gray-300
          hover:from-gray-300 hover:to-gray-400
          text-gray-700 font-medium py-2 px-6 rounded-lg
          shadow hover:shadow-md
          transition-all duration-200
          transform hover:scale-105
          active:scale-95
          border-none
          focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50
          ml-3
        `,
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `
            <div class="flex items-center justify-center text-green-500">
              <i class="fas fa-check-circle text-4xl mr-2"></i>
              <span class="text-xl font-bold">Confirmation</span>
            </div>
          `,
          html: `
            <div class="text-center py-2">
              <p class="text-gray-700">Ouverture de l'éditeur...</p>
            </div>
          `,
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            setShowEditModal(true);
          },
        });
      }
    });
  };

  // Gestion de la suppression d'un cours
  const handleDeleteCours = async (id) => {
    const isConfirmed = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas annuler cette action !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    });

    if (!isConfirmed.isConfirmed) {
      setDropdownPopoverShow(false);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token manquant");

      await axios.delete(
        `http://localhost:8087/api/espaceCours/deleteEspaceCours/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        title: "Supprimé !",
        text: "Le cours a été supprimé avec succès.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      window.location.reload();
    } catch (err) {
      Swal.fire({
        title: "Erreur !",
        text: "La suppression a échoué : " + err.message,
        icon: "error",
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
      setDropdownPopoverShow(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      {isAdmin ? (
        <>
          {/* Bouton pour ouvrir le menu déroulant (admin) */}
          <button
            type="button"
            className="text-indigo-600 hover:text-indigo-800 p-3 rounded-full hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
            ref={btnDropdownRef}
            onClick={() => setDropdownPopoverShow(!dropdownPopoverShow)}
            aria-expanded={dropdownPopoverShow}
            aria-haspopup="true"
            disabled={isLoading}
          >
            <i
              className={`fas fa-ellipsis-v transition-transform duration-200 ${
                dropdownPopoverShow ? "rotate-90" : ""
              }`}
            ></i>
          </button>

          {/* Menu déroulant pour les admins */}
          <div
            ref={popoverDropdownRef}
            className={`${
              dropdownPopoverShow ? "block" : "hidden"
            } absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-white border border-gray-200 z-50`}
            style={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <div className="py-1">
              {/* Bouton Consulter */}
              <button
                type="button"
                className="action-btn edit-btn flex w-full items-center px-4 py-3 text-sm text-amber-700 hover:text-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] group border-b border-amber-100 last:border-b-0"
                onClick={handleOpenModal}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 hover:bg-indigo-200 mr-3 transition-colors duration-200">
                  <i className="far fa-eye text-indigo-600 text-sm"></i>
                </div>
                <span className="font-medium">
                  {isLoading ? "Chargement..." : "Consulter"}
                </span>
              </button>

              {/* Bouton Éditer */}
              <button
                type="button"
                className="action-btn view-btn flex w-full items-center px-4 py-3 text-sm text-indigo-700 hover:text-indigo-800 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] group border-b border-indigo-100 last:border-b-0"
                onClick={() => handleEditClick(coursItem)}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 mr-3 transition-colors duration-200">
                  <i className="fas fa-edit text-amber-600 text-sm"></i>
                </div>
                <span className="font-medium">Éditer le cours</span>
              </button>

              {/* Bouton Supprimer */}
              <button
                type="button"
                className="action-btn delete-btn flex w-full items-center px-4 py-3 text-sm text-rose-700 hover:text-rose-800 bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] group border-b border-rose-100 last:border-b-0"
                onClick={() => handleDeleteCours(coursItem.idespac)}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 mr-3 transition-colors duration-200">
                  <i className="fas fa-trash-alt text-rose-600 text-sm"></i>
                </div>
                <span className="font-medium">Supprimer</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <button
          type="button"
          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-md transition-colors shadow-sm hover:shadow-md"
          onClick={handleOpenModal}
          disabled={isLoading}
        >
          <i className="far fa-eye mr-2"></i>
          {isLoading ? "Chargement..." : "Consulter"}
        </button>
      )}
      {showEditModal && (
        <EditCourseModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          course={selectedCourse}
          onSave={(updatedCourse) => {
            if (onEdit) {
              onEdit(updatedCourse);
            }
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TableDropdown;

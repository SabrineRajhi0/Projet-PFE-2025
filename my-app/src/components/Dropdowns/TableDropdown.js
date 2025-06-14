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
  const afficherItemCour = async (id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token manquant");

      // First fetch the espaceCours by ID
      const response = await axios.get(
        `http://localhost:8087/api/element/v1/getByEspaceCoursId/${id}`
      );
      const element = response.data;
      console.log(element);
      // Check if it's a PDF (you might need to adjust this check based on your data structure)
      // Construct the full URL to the PDF file on your server
      if (element) {
        const pdfUrl = `http://localhost:8087/${element.cheminElt}`;

        // Open the PDF in a new tab
        window.open(pdfUrl, "_blank");
      } else {
        // For non-PDF content, show a preview or download
        Swal.fire({
          title: "Contenu du cours",
          html: `
          <div class="text-left p-4">

            <p class="mb-2 text-gray-700">${
              element.desElt || "Aucune description disponible"
            }</p>
            <div class="mt-4">
              <a href="http://localhost:8087/${element.cheminElt}" 
                 class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                 download>
                <i class="fas fa-download mr-2"></i>
                Télécharger le fichier
              </a>
            </div>
          </div>
        `,
          confirmButtonText: "Fermer",
          customClass: {
            popup: "rounded-lg shadow-xl",
            confirmButton:
              "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md",
          },
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Erreur",
        text:
          "Impossible d'afficher le cours: " +
          (err.response?.data?.message || err.message),
        icon: "error",
        timer: 3000,
        customClass: {
          popup: "rounded-lg shadow-xl",
        },
      });
    } finally {
      setIsLoading(false);
      setDropdownPopoverShow(false);
    }
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
                onClick={() => afficherItemCour(coursItem.idespac)}
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
          onClick={() => afficherItemCour(coursItem.idespac)}
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
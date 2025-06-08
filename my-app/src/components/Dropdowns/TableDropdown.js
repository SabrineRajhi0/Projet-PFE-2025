import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const TableDropdown = ({ coursItem, showOnlyAfficher = false, onEdit }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = useRef(null);
  const popoverDropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const fetchElementByIdElt = async (id_elt) => {
    try {
      // This is a public endpoint, no token needed
      const response = await axios.get(
        `http://localhost:8087/api/element/v1/getByEspaceCoursId/${id_elt}`
      );
      return response.data;
    } catch (err) {
      let message;
      const status = err.response?.status;
      const errorMessage = err.response?.data?.message;
      
      if (status === 404) {
        message = "Aucun élément trouvé pour ce cours.";
      } else if (status === 403) {
        message = "Vous n'avez pas accès à cet élément de cours.";
      } else if (status === 500) {
        message = "Une erreur serveur s'est produite lors de la récupération de l'élément.";
      } else {
        message = errorMessage || err.message || "Erreur lors de la récupération de l'élément.";
      }
      throw new Error(message);
    }
  };

  const handleAfficher = async () => {
    setIsLoading(true);
    try {
      const element = await fetchElementByIdElt(coursItem.idespac);
      if (element?.cheminElt) {
        const fileUrl = `http://localhost:8087/${element.cheminElt}`;
        window.open(fileUrl, "_blank");
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Fichier introuvable',
          text: 'Le fichier est manquant pour cet élément.',
          confirmButtonColor: '#3085d6'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.message,
        confirmButtonColor: '#3085d6'
      });
      Swal.fire("Erreur", err.message, "error");
    } finally {
      setIsLoading(false);
      setDropdownPopoverShow(false);
    }
  };

  // Navigate to admin edit espace cours page with state
  const handleNavigateToEditCour = (cours) => {
    // Show confirmation SweetAlert before navigating
    Swal.fire({
      title: 'Modification du cours',
      html: `<div class="text-center">
               <p class="mb-2">Vous allez modifier le cours:</p>
               <p class="font-semibold text-blue-600">${cours.nomespac || 'sélectionné'}</p>
             </div>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fas fa-check mr-1"></i> Continuer',
      cancelButtonText: '<i class="fas fa-times mr-1"></i> Annuler',
      customClass: {
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel'
      },
      buttonsStyling: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to edit page when confirmed
        navigate(`/admin/ModifierCoursPage`, { state: { cours } });
      }
    });
  };
  
  // Handle edit button click - either use the provided onEdit function or navigate
  const handleEditClick = (course) => {
    setDropdownPopoverShow(false); // Close dropdown first
    
    if (onEdit) {
      // If an onEdit function was provided, use that
      onEdit(course);
    } else {
      // Otherwise use the default navigation behavior
      handleNavigateToEditCour(course);
    }
  };

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

    if (!isConfirmed.isConfirmed) return;

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
    <>
      {showOnlyAfficher ? (
        <button
          type="button"
          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-md transition-colors shadow-sm hover:shadow-md !important"
          onClick={handleAfficher}
          disabled={isLoading}
        >
          <i className="far fa-eye mr-2"></i>
          {isLoading ? "Chargement..." : "Afficher"}
        </button>
      ) : (
        <>
          <div className="ellipsis-btn-container relative inline-block text-left">
            <button
              type="button"
              className="ellipsis-btn text-indigo-600 hover:text-indigo-800 p-3 rounded-full hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
              ref={btnDropdownRef}
              onClick={() => setDropdownPopoverShow((prev) => !prev)}
              aria-expanded={dropdownPopoverShow}
              aria-haspopup="true"
            >
              <i className={`fas fa-ellipsis-v transition-transform duration-200 ${dropdownPopoverShow ? 'rotate-90' : ''}`}></i>
            </button>

          <div
            ref={popoverDropdownRef}
            className={`${
              dropdownPopoverShow ? "block dropdown-menu animate-fadeIn" : "hidden"
            } dropdown-positioned bg-white text-base py-2 list-none text-left rounded-lg shadow-xl w-52 border border-gray-200 backdrop-blur-sm`}
            style={{
              position: 'absolute',
              right: '0',
              top: '100%',
              marginTop: '0.5rem',
              zIndex: 99999,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(229, 231, 235, 0.8)',
              background: 'rgba(255, 255, 255, 0.95)'
            }}
          >
            <button
              type="button"
              className="action-btn edit-btn flex w-full items-center px-4 py-3 text-sm text-amber-700 hover:text-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] group border-b border-amber-100 last:border-b-0"
              onClick={() => handleEditClick(coursItem)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 group-hover:bg-amber-200 mr-3 transition-colors duration-200">
                <i className="fas fa-edit text-amber-600 text-sm transition-transform group-hover:scale-110"></i>
              </div>
              <span className="font-medium">Éditer le cours</span>
            </button>

            <button
              type="button"
              className="action-btn view-btn flex w-full items-center px-4 py-3 text-sm text-indigo-700 hover:text-indigo-800 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] group border-b border-indigo-100 last:border-b-0"
              onClick={() => handleNavigateToEditCour(coursItem)}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 group-hover:bg-indigo-200 mr-3 transition-colors duration-200">
                <i className="far fa-eye text-indigo-600 text-sm transition-transform group-hover:scale-110"></i>
              </div>
              <span className="font-medium">{isLoading ? "Chargement..." : "Consulter"}</span>
            </button>

            <button
              type="button"
              className="action-btn delete-btn flex w-full items-center px-4 py-3 text-sm text-rose-700 hover:text-rose-800 bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] group border-b border-rose-100 last:border-b-0"
              onClick={() => handleDeleteCours(coursItem.idespac)}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 group-hover:bg-rose-200 mr-3 transition-colors duration-200">
                <i className="fas fa-trash-alt text-rose-600 text-sm transition-transform group-hover:scale-110"></i>
              </div>
              <span className="font-medium">Supprimer</span>
            </button>
          </div>
          </div>
        </>
      )}
    </>
  );
};

export default TableDropdown;

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
          className="flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-md transition-colors shadow-sm"
          onClick={handleAfficher}
          disabled={isLoading}
        >
          <i className="far fa-eye mr-2"></i>
          {isLoading ? "Chargement..." : "Afficher"}
        </button>
      ) : (
        <>
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
              ref={btnDropdownRef}
              onClick={() => setDropdownPopoverShow((prev) => !prev)}
              aria-expanded={dropdownPopoverShow}
              aria-haspopup="true"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>

          <div
            ref={popoverDropdownRef}
            className={`${dropdownPopoverShow ? "block dropdown-menu" : "hidden"} bg-white text-base z-[1000] py-2 list-none text-left rounded-lg shadow-lg min-w-48 border border-slate-100`}
            style={{ position: 'absolute', right: '0', top: '100%', marginTop: '4px', width: '180px', maxWidth: '95vw' }}
          >
            <button
              type="button"
              className="flex w-full items-center px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              onClick={() => handleEditClick(coursItem)}
            >
              <i className="fas fa-edit text-yellow-500 mr-3 w-4 text-center"></i>
              Éditer
            </button>

            <button
              type="button"
              className="flex w-full items-center px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              onClick={() => handleNavigateToEditCour(coursItem)}
              disabled={isLoading}
            >
              <i className="far fa-eye text-blue-500 mr-3 w-4 text-center"></i>
              {isLoading ? "Chargement..." : "Afficher"}
            </button>

            <button
              type="button"
              className="flex w-full items-center px-4 py-2.5 hover:bg-red-50 text-slate-700 font-medium transition-colors"
              onClick={() => handleDeleteCours(coursItem.idespac)}
              disabled={isLoading}
            >
              <i className="fas fa-trash-alt text-red-500 mr-3 w-4 text-center"></i>
              Supprimer
            </button>
          </div>
          </div>
        </>
      )}
    </>
  );
};

export default TableDropdown;

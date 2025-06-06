import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import EditCourseModal from "components/Cards/EditCourseModal.js";
import { fetchEspacesCoursWithElements } from "../../Services/services";
import { AuthContext } from "views/auth/AuthContext"; // Import du contexte

// Constantes API
const API_BASE_URL = "http://localhost:8087/api";
const TYPE_ELEMENTS_URL = `${API_BASE_URL}/type-element/getAllTypeElements`;
const ESPACE_COURS_URL = `${API_BASE_URL}/espaceCours/getAllEspaceCours`;

export default function CardCours({ color = "light" }) {
  const navigate = useNavigate();
  const { user, refreshAccessToken } = useContext(AuthContext);

  const [editCourse, setEditCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cours, setCours] = useState([]);

  // Fonction pour normaliser les rôles
  const getNormalizedRole = useCallback((roles) => {
    if (!roles || !Array.isArray(roles)) return null;
    if (roles.includes("ROLE_ADMIN")) return "admin";
    if (roles.includes("ROLE_ENSEIGNANT")) return "enseignant";
    if (roles.includes("ROLE_APPRENANT")) return "apprenant";
    return null;
  }, []);

  const normalizedRole = useMemo(
    () => user && getNormalizedRole(user.roles),
    [user, getNormalizedRole]
  );

  // Fonction pour requêtes avec token + rafraîchissement
  const fetchDataWithAuth = useCallback(async (url, options = {}) => {
    try {
      let token = user?.accessToken;
      const response = await axios.get(url, {
        ...options,
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const response = await axios.get(url, {
            ...options,
            headers: { Authorization: `Bearer ${newToken}` }
          });
          return response;
        }
      }
      throw error;
    }
  }, [user, refreshAccessToken]);

  // Chargement initial des cours
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [, coursRes] = await Promise.all([
          fetchDataWithAuth(TYPE_ELEMENTS_URL), // peut être supprimé si inutile
          fetchEspacesCoursWithElements(user.accessToken)
        ]);
        setCours(coursRes);
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error);
      }
    };

    if (user?.accessToken) {
      fetchInitialData();
    }
  }, [user, fetchDataWithAuth]);

  // Chargement conditionnel selon rôle
  useEffect(() => {
    const fetchCoursWithAuth = async () => {
      if (!user) return;
      const role = getNormalizedRole(user.roles);
      if (!["enseignant", "apprenant", "admin"].includes(role)) return;

      try {
        const token = user.accessToken || localStorage.getItem("accessToken");
        const response = await axios.get(ESPACE_COURS_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCours(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des cours :", error);
      }
    };

    fetchCoursWithAuth();
  }, [user, getNormalizedRole]);

  const handleEdit = (course) => {
    setEditCourse(course);
    setIsModalOpen(true);
  };

  const handleSave = (updated) => {
    setCours((prev) =>
      prev.map((c) => (c.idespac === updated.idespac ? updated : c))
    );
    setIsModalOpen(false);
  };

  return (
    <div
      className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg overflow-hidden bg-white"
    >
      <EditCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={editCourse}
        onSave={handleSave}
      />

      {normalizedRole === "admin" && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-blue-100 flex justify-end">
          <button
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-md transition-all shadow-sm hover:shadow-md hover:from-blue-700 hover:to-indigo-700"
            onClick={() => navigate("/admin/AjouterEspaceCours")}
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Nouvel Espace Cours
          </button>
        </div>
      )}

      <div className="rounded-t mb-0 px-6 py-6 border-0 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-xl text-white">
              Espace Cours
            </h3>
            <p className="text-blue-100 mt-1 text-sm">
              Retrouvez tous vos cours et documents pédagogiques
            </p>
          </div>
        </div>
      </div>

      <div className="block w-full overflow-x-auto p-4">
        <table className="course-table w-full">
          <thead>
            <tr>
              <th className="w-1/12">Id</th>
              <th className="w-4/12">Cours</th>
              <th className="w-5/12">Description</th>
              <th className="w-2/12 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {cours.map((coursItem) => (
              <tr key={coursItem.idespac}>
                <td className="text-sm text-slate-500">{coursItem.idespac}</td>
                <td>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <i className="fas fa-book text-blue-500 text-lg"></i>
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-slate-800">{coursItem.titre}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm text-slate-600 max-w-md line-clamp-2">{coursItem.description}</div>
                </td>
                <td className="text-center">
                  <div className="flex justify-center items-center">
                    <TableDropdown
                      coursItem={coursItem}
                      showOnlyAfficher={normalizedRole !== "admin"}
                      onEdit={handleEdit}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {cours.length === 0 && (
              <tr>
                <td colSpan="4" className="py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-20 w-20 text-blue-100 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-folder-open text-blue-400 text-3xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-slate-700 mb-2">Aucun cours disponible</h3>
                    <p className="text-slate-500 text-center max-w-md mb-6">
                      Il n'y a pas de cours disponibles pour le moment. 
                      {normalizedRole === "admin" && " Commencez par ajouter un nouveau cours."}
                    </p>
                    {normalizedRole === "admin" && (
                      <button 
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-md shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
                        onClick={() => navigate("/admin/AjouterEspaceCours")}
                      >
                        <i className="fas fa-plus-circle mr-2"></i>
                        Ajouter un cours
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

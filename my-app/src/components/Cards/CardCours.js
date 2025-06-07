import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import EditCourseModal from "components/Cards/EditCourseModal.js";
import { AuthContext } from "views/auth/AuthContext";
import { toast } from 'react-toastify';

// Constantes API
const API_BASE_URL = "http://localhost:8087/api";
const ESPACE_COURS_URL = `${API_BASE_URL}/espaceCours/getAllEspaceCours`;

export default function CardCours({ color = "light" }) {
  const navigate = useNavigate();
  const { user, refreshAccessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [editCourse, setEditCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cours, setCours] = useState([]);
  const [error, setError] = useState(null);

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
  const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
    try {
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }

      // Verify user role before making request
      const userRole = user.roles?.find(role => 
        ['ROLE_ADMIN', 'ROLE_ENSEIGNANT', 'ROLE_APPRENANT'].includes(role)
      );
      
      if (!userRole) {
        throw new Error('Vous n\'avez pas les permissions nécessaires');
      }

      const token = user.accessToken;
      const response = await axios({
        ...options,
        url,
        method: options.method || 'GET',
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Role': userRole // Add role to header for backend verification
        }
      });

      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          const userRole = user.roles?.find(role => 
            ['ROLE_ADMIN', 'ROLE_ENSEIGNANT', 'ROLE_APPRENANT'].includes(role)
          );
          
          if (newToken) {
            const retryResponse = await axios({
              ...options,
              url,
              method: options.method || 'GET',
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application/json',
                'Role': userRole
              }
            });
            return retryResponse;
          }
        } catch (refreshError) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
      }
      throw error;
    }
  }, [user, refreshAccessToken]);

  // Chargement initial des cours
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        if (!user) {
          throw new Error('Veuillez vous connecter pour accéder à cette page');
        }

        // Verify role authorization
        if (!user.roles?.some(role => ['ROLE_ADMIN', 'ROLE_ENSEIGNANT', 'ROLE_APPRENANT'].includes(role))) {
          throw new Error('Vous n\'avez pas les permissions nécessaires');
        }

        // Get courses based on role
        const coursRes = await makeAuthenticatedRequest(ESPACE_COURS_URL);
        setCours(coursRes.data);
        setError(null);
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error);
        
        // Handle different error types
        if (error.message === 'Session expirée. Veuillez vous reconnecter.' || 
            error.message === 'Veuillez vous connecter pour accéder à cette page') {
          setError('Votre session a expiré. Veuillez vous reconnecter.');
          toast.error('Session expirée');
          navigate('/auth/login');
          return;
        }
        
        if (error.message === 'Vous n\'avez pas les permissions nécessaires' ||
            error.response?.status === 403) {
          const message = error.response?.data?.message || 
            'Accès non autorisé. Veuillez vérifier vos permissions pour cet élément de cours.';
          setError(message);
          toast.error(message);
          
          // If it's a specific course access issue, we might want to reload the course list
          if (error.config?.url?.includes('/getByEspaceCoursId/')) {
            makeAuthenticatedRequest(ESPACE_COURS_URL)
              .then(response => {
                setCours(response.data);
              })
              .catch(err => console.error('Error reloading courses:', err));
          }
          return;
        }

        // Handle other API errors
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors du chargement des cours';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate, makeAuthenticatedRequest, user]);

  // If loading or error, show appropriate UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <div className="text-xl font-bold mb-2">Erreur</div>
        <div>{error}</div>
      </div>
    );
  }

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

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from 'views/auth/AuthContext';
import Sidebar from "components/Sidebar/Sidebar.js";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ViewCours() {
  const { user, loading, refreshAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { cours } = location.state || {};
  const [elements, setElements] = useState([]);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
    try {
      const token = user?.accessToken;
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await axios({
        ...options,
        url,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const retryResponse = await axios({
            ...options,
            url,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            }
          });
          return retryResponse;
        }
      }
      throw error;
    }
  }, [user, refreshAccessToken]);
  
  useEffect(() => {
    const validateAndFetch = async () => {
      try {
        // Check authentication first
        if (!user) {
          setIsAuthenticated(false);
          return;
        }

        if (!Array.isArray(user.roles) || !user.roles.includes("ROLE_APPRENANT")) {
          setError("Vous n'avez pas les permissions nécessaires pour accéder à ce cours.");
          return;
        }

        if (!cours?.idespac) {
          setError("ID du cours manquant");
          return;
        }

        const response = await axios.get(
          `http://localhost:8087/api/element/v1/getByEspaceCoursId/${cours.idespac}`
        );
        
        setElements(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching course elements:', error);
        if (error.response?.status === 403) {
          setError('Vous n\'avez pas les permissions nécessaires pour accéder à ce cours.');
          toast.error('Accès refusé');
        } else if (error.message === 'No access token available') {
          setIsAuthenticated(false);
        } else {
          setError('Une erreur est survenue lors de la récupération des éléments du cours');
          toast.error(error.response?.data?.message || 'Une erreur est survenue');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      validateAndFetch();
    }
  }, [cours?.idespac, user, loading, refreshAccessToken, navigate, makeAuthenticatedRequest]);

  // Handle authentication redirect
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl text-red-600">{error}</h2>
      </div>
    );
  }

  if (!cours) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl text-red-600">Cours non trouvé</h2>
      </div>
    );
  }

  const handleDownload = async (element) => {
    if (!element?.cheminElt) {
      toast.error('Chemin du fichier invalide');
      return;
    }

    try {
      setDownloadingFile(element.idElt);
      
      const response = await makeAuthenticatedRequest(
        `http://localhost:8087/uploads/${element.cheminElt}`,
        {
          method: 'GET',
          responseType: 'blob',
        }
      );
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = element.cheminElt.split('/').pop(); // Get filename from path
      link.setAttribute('download', filename);
      
      // Cleanup function to handle resources
      const cleanup = () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
        setDownloadingFile(null);
      };

      // Start download
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay to ensure download starts
      setTimeout(cleanup, 1000);
      
      toast.success(`Téléchargement de "${filename}" réussi !`);
    } catch (error) {
      console.error('Download error:', error);
      if (error.response?.status === 403) {
        toast.error('Vous n\'avez pas la permission de télécharger ce fichier');
      } else if (error.response?.status === 404) {
        toast.error('Le fichier demandé n\'existe plus');
      } else {
        toast.error('Erreur lors du téléchargement. Veuillez réessayer.');
      }
      setDownloadingFile(null);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <div className="px-6 py-8 bg-gray-100 min-h-screen mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-blue-500">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {cours.titre || cours.nomespac}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {cours.description || cours.desespac}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/apprenant')}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Retour aux cours
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Éléments du cours
                </h3>
                {elements && elements.length > 0 ? (
                  <div className="space-y-4">
                    {elements.map((element) => (
                      <div 
                        key={element.idElt} 
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <h4 className="font-medium text-gray-800">
                          Description: {element.desElt}
                        </h4>
                        {element.cheminElt && (
                          <button
                            onClick={() => handleDownload(element)}
                            disabled={downloadingFile === element.idElt}
                            className={`mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 ${
                              downloadingFile === element.idElt ? 'opacity-50 cursor-wait' : ''
                            }`}
                          >
                            {downloadingFile === element.idElt ? (
                              <>
                                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                                Téléchargement...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-download mr-2"></i>
                                Télécharger
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <i className="fas fa-folder-open text-4xl"></i>
                    </div>
                    <p className="text-gray-500">
                      Aucun élément disponible pour ce cours
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <FooterAdmin />
      </div>
    </>
  );
}

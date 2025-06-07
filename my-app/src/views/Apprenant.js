import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Apprenant() {
  const [espaces, setEspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, refreshAccessToken } = useContext(AuthContext);

  const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
    try {
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }

      const response = await axios({
        ...options,
        url,
        method: options.method || 'GET',
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            const retryResponse = await axios({
              ...options,
              url,
              method: options.method || 'GET',
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application/json'
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

  useEffect(() => {
    const fetchEspaces = async () => {
      try {
        if (!user) {
          throw new Error('Veuillez vous connecter pour accéder à cette page');
        }

        const response = await makeAuthenticatedRequest('http://localhost:8087/api/espaceCours/tablcour');
        setEspaces(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching espaces:', error);
        if (error.message === 'Session expirée. Veuillez vous reconnecter.' || 
            error.message === 'Veuillez vous connecter pour accéder à cette page') {
          navigate('/auth/login');
        } else {
          setError(
            error.response?.status === 403 
              ? 'Accès non autorisé. Veuillez vérifier vos permissions.'
              : 'Erreur lors de la récupération des espaces de cours'
          );
          toast.error(error.response?.data?.message || 'Une erreur est survenue');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEspaces();
  }, [navigate, makeAuthenticatedRequest]);

  const handleAfficher = async (espace) => {
    try {
      try {
        const response = await axios.get(
          `http://localhost:8087/api/element/v1/getByEspaceCoursId/${espace.idespac}`
        );
        
        navigate(`/apprenant/cours/${espace.idespac}`, {
          state: { 
            cours: espace,
            elements: response.data
          }
        });
      } catch (error) {
        console.error('Error:', error);
        if (error.response?.status === 403) {
          toast.error('Accès non autorisé. Veuillez vérifier vos permissions.');
        } else if (error.response?.status === 401) {
          navigate('/auth/login');
          toast.error('Session expirée. Veuillez vous reconnecter.');
        } else {
          toast.error(error.response?.data?.message || 'Une erreur est survenue lors du chargement du cours');
        }
      }
    } catch (error) {
      console.error('Error fetching course elements:', error);
      if (error.message === 'Session expirée. Veuillez vous reconnecter.') {
        navigate('/auth/login');
      } else {
        setError(
          error.response?.status === 403
            ? 'Accès non autorisé. Veuillez vérifier vos permissions.'
            : 'Erreur lors de la récupération des éléments du cours'
        );
        toast.error(error.response?.data?.message || 'Une erreur est survenue');
      }
    }
  };

  if (isLoading) {
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

  return (
    <div className="relative bg-gray-100 min-h-screen">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Retrouvez tous vos cours et documents pédagogiques
        </h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  COURS
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  DESCRIPTION
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {espaces.map((espace) => (
                <tr key={espace.idespac} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {espace.idespac}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <i className="fas fa-book text-blue-500 mr-2"></i>
                      {espace.titre || espace.nomespac}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {espace.description || espace.desespac}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      onClick={() => handleAfficher(espace)}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors duration-150 ease-in-out"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      Afficher
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Apprenant;
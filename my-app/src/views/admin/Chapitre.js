import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

// Base URL for API calls
const BASE_URL = "http://localhost:8087";

// Configure axios instance with proper CORS and authentication headers
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // or sessionStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    
    return Promise.reject(error);

  }
);

// Add response interceptor to handle 403 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      toast.error('Session expirée ou accès non autorisé');
      console.log(error);
      // Redirect to login if needed
      localStorage.removeItem('accessToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default function Chapitre() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChapitre, setSelectedChapitre] = useState(null);
  const [chapitres, setChapitres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [espaceCours, setEspaceCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newChapitre, setNewChapitre] = useState({
    nomchap: '',
    niveau: { id: '' },
    espaceCours: { idespac: '' }
  });

  // Helper function to extract error message
  const getErrorMessage = (error) => {
    if (!error) return 'Une erreur inconnue est survenue';
    if (typeof error === 'string') return error;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.error) return error.response.data.error;
    if (typeof error.response?.data === 'string') return error.response.data;
    if (error.message) return error.message;
    return 'Une erreur est survenue';
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [chapitresRes, niveauxRes, espaceCoursRes] = await Promise.all([
          axiosInstance.get('/api/chapitre/getAllChapitres'),
          axiosInstance.get('/api/niveau/getAllNiveau'),
          axiosInstance.get('/api/espaceCours/getAllEspaceCours')
        ]);

        setChapitres(Array.isArray(chapitresRes.data) ? chapitresRes.data : []);
        setNiveaux(Array.isArray(niveauxRes.data) ? niveauxRes.data : []);
        setEspaceCours(Array.isArray(espaceCoursRes.data) ? espaceCoursRes.data : []);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) {
      setError('Veuillez vous connecter pour accéder à cette page');
      toast.error('Session non trouvée. Veuillez vous reconnecter.');
      // Uncomment the next line if you want to redirect to login
      window.location.href = '/auth/login';
      return;
    }
  }, []);

  // Handle input changes for new chapter
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'niveau') {
      setNewChapitre(prev => ({
        ...prev,
        niveau: { id: value }
      }));
    } else if (name === 'espaceCours') {
      setNewChapitre(prev => ({
        ...prev,
        espaceCours: { idespac: value }
      }));
    } else {
      setNewChapitre(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle input changes for editing chapter
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'niveau') {
      setSelectedChapitre(prev => ({
        ...prev,
        niveau: { id: value }
      }));
    } else if (name === 'espaceCours') {
      setSelectedChapitre(prev => ({
        ...prev,
        espaceCours: { idespac: value }
      }));
    } else {
      setSelectedChapitre(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Add new chapter
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/chapitre/addchapitre', newChapitre);
      if (response.data) {
        setChapitres([...chapitres, response.data]);
        setShowAddModal(false);
        setNewChapitre({
          nomchap: '',
          niveau: { id: '' },
          espaceCours: { idespac: '' }
        });
        toast.success('Chapitre ajouté avec succès');
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      console.error('Error adding chapter:', err);
      toast.error(errorMsg);
    }
  };

  // Update existing chapter
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedChapitre) return;
    try {
      const response = await axiosInstance.put(
        `/api/chapitre/updatechapitre/${selectedChapitre.idchap}`,
        selectedChapitre
      );
      if (response.data) {
        setChapitres(chapitres.map(chapitre =>
          chapitre.idchap === selectedChapitre.idchap ? response.data : chapitre
        ));
        setShowEditModal(false);
        setSelectedChapitre(null);
        toast.success('Chapitre modifié avec succès');
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      console.error('Error updating chapter:', err);
      toast.error(errorMsg);
    }
  };

  // Delete chapter
  const handleDelete = async (idchap) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce chapitre ?')) return;
    try {
      await axiosInstance.delete(`/api/chapitre/deleteChapitre/${idchap}`);
      setChapitres(chapitres.filter(chapitre => chapitre.idchap !== idchap));
      toast.success('Chapitre supprimé avec succès');
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      console.error('Error deleting chapter:', err);
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-blueGray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blueGray-700">Gestion des Chapitres</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-cyan-500 text-white active:bg-cyan-600 font-bold text-xs px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        >
          <i className="fas fa-plus mr-2"></i>
          AJOUTER UN CHAPITRE
        </button>
      </div>

      {/* Chapters Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapitres.map((chapitre) => (
            <div 
              key={chapitre.idchap}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-grow">
                <h3 className="font-medium">{chapitre.nomchap}</h3>
                <p className="text-sm text-gray-600">
                  Niveau: {chapitre.niveau?.nom || 'Non défini'} |
                  Espace: {chapitre.espaceCours?.nom || 'Non défini'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedChapitre(chapitre);
                    setShowEditModal(true);
                  }}
                  className="text-cyan-500 hover:text-cyan-700"
                  title="Modifier"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(chapitre.idchap)}
                  className="text-red-500 hover:text-red-700"
                  title="Supprimer"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                  <h3 className="text-2xl font-semibold">Ajouter un chapitre</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  >
                    <span className="text-black h-6 w-6 text-2xl block">×</span>
                  </button>
                </div>
                <form onSubmit={handleAdd}>
                  <div className="relative p-6 flex-auto">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Nom du chapitre
                      </label>
                      <input
                        type="text"
                        name="nomchap"
                        value={newChapitre.nomchap}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Niveau
                      </label>
                      <select
                        name="niveau"
                        value={newChapitre.niveau.id}
                        onChange={handleInputChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="">Sélectionner un niveau</option>
                        {niveaux.map(niveau => (
                          <option key={niveau.id} value={niveau.id}>
                            {niveau.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Espace Cours
                      </label>
                      <select
                        name="espaceCours"
                        value={newChapitre.espaceCours.idespac}
                        onChange={handleInputChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="">Sélectionner un espace cours</option>
                        {espaceCours.map(espace => (
                          <option key={espace.idespac} value={espace.idespac}>
                            {espace.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-cyan-500 text-white active:bg-cyan-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedChapitre && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                  <h3 className="text-2xl font-semibold">Modifier le chapitre</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  >
                    <span className="text-black h-6 w-6 text-2xl block">×</span>
                  </button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="relative p-6 flex-auto">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Nom du chapitre
                      </label>
                      <input
                        type="text"
                        name="nomchap"
                        value={selectedChapitre.nomchap}
                        onChange={handleEditInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Niveau
                      </label>
                      <select
                        name="niveau"
                        value={selectedChapitre.niveau?.id || ''}
                        onChange={handleEditInputChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="">Sélectionner un niveau</option>
                        {niveaux.map(niveau => (
                          <option key={niveau.id} value={niveau.id}>
                            {niveau.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Espace Cours
                      </label>
                      <select
                        name="espaceCours"
                        value={selectedChapitre.espaceCours?.idespac || ''}
                        onChange={handleEditInputChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="">Sélectionner un espace cours</option>
                        {espaceCours.map(espace => (
                          <option key={espace.idespac} value={espace.idespac}>
                            {espace.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-cyan-500 text-white active:bg-cyan-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    >
                      Modifier
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
}
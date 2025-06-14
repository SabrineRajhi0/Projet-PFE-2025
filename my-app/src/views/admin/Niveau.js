import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import "@fortawesome/fontawesome-free/css/all.min.css";

const BASE_URL = "http://localhost:8087";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Ajouter le token JWT automatiquement
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Fix template string here
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour 403
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      toast.error('Session expirée ou accès non autorisé');
      localStorage.removeItem('accessToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default function Niveau() {
  const [niveaux, setNiveaux] = useState([]);
  const [newNiveau, setNewNiveau] = useState({ nom: '' });
  const [selectedNiveau, setSelectedNiveau] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getErrorMessage = (error) => {
    if (!error) return 'Une erreur inconnue est survenue';
    if (typeof error === 'string') return error;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.error) return error.response.data.error;
    if (typeof error.response?.data === 'string') return error.response.data;
    if (error.message) return error.message;
    return 'Une erreur est survenue';
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Veuillez vous connecter');
      toast.error('Session non trouvée.');
      window.location.href = '/auth/login';
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/api/niveau/getAllNiveau');
        setNiveaux(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        const msg = getErrorMessage(err);
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/niveau/addNiveau', newNiveau);
      // Make sure added niveau has an id
      const addedNiveau = res.data?.id ? res.data : { ...newNiveau, id: Date.now() };
      setNiveaux([...niveaux, addedNiveau]);
      setNewNiveau({ nom: '' });
      setShowAddModal(false);
      toast.success("Niveau ajouté !");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/niveau/updateNiveau/${selectedNiveau.id}`, selectedNiveau);
      setNiveaux(niveaux.map(n => n.id === selectedNiveau.id ? selectedNiveau : n));
      setSelectedNiveau(null);
      setShowEditModal(false);
      toast.success("Niveau modifié !");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce niveau ?")) return;
    try {
      await axiosInstance.delete(`/api/niveau/deleteNiveau/${id}`);
      setNiveaux(niveaux.filter(n => n.id !== id));
      toast.success("Niveau supprimé !");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNiveau(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedNiveau(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-blueGray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gestion des Niveaux</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-cyan-500 text-white px-4 py-2 rounded shadow hover:bg-cyan-600"
        >
          <i className="fas fa-plus mr-2"></i> Ajouter un niveau
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-blueGray-50 text-xs text-blueGray-600 uppercase">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nom</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={3} className="text-center py-4">Chargement...</td></tr>
            )}
            {!loading && niveaux.length === 0 && (
              <tr><td colSpan={3} className="text-center py-4">Aucun niveau trouvé.</td></tr>
            )}
            {niveaux.map(n => (
              <tr key={n.id || n.nom } className="hover:bg-blueGray-50">
                <td className="px-6 py-2">{n.id}</td>
                <td className="px-6 py-2">{n.nom}</td>
                <td className="px-6 py-2 text-right">
                  <button
                    onClick={() => {
                      setSelectedNiveau(n);
                      setShowEditModal(true);
                    }}
                    className="text-cyan-500 hover:text-cyan-700 mx-2"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-red-500 hover:text-red-700 mx-2"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajout */}
      {showAddModal && (
        <Modal title="Ajouter un niveau" onClose={() => setShowAddModal(false)} onSubmit={handleAdd}>
          <input
            type="text"
            name="nom"
            placeholder="Nom du niveau"
            value={newNiveau.nom}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded mb-3"
          />
        </Modal>
      )}

      {/* Modal Modification */}
      {showEditModal && selectedNiveau && (
        <Modal title="Modifier le niveau" onClose={() => setShowEditModal(false)} onSubmit={handleUpdate}>
          <input
            type="text"
            name="nom"
            value={selectedNiveau.nom}
            onChange={handleEditInputChange}
            required
            className="w-full p-2 border rounded mb-3"
          />
        </Modal>
      )}
    </div>
  );
}

// Modal générique
function Modal({ title, children, onClose, onSubmit }) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button onClick={onClose} className="text-2xl leading-none">×</button>
          </div>
          <form onSubmit={onSubmit} className="p-4">
            {children}
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={onClose} className="px-4 py-2 mr-2 border rounded">Annuler</button>
              <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">Valider</button>
            </div>
          </form>
        </div>
      </div>
      <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
    </>
  );
}
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Niveau() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNiveau, setSelectedNiveau] = useState(null);
  const [niveaux, setNiveaux] = useState([
    { id: 1, nom: '1 ere' },
    { id: 2, nom: '2 eme' },
    { id: 3, nom: '3 eme' },
    { id: 4, nom: 'bacc' }
  ]);
  const [newNiveau, setNewNiveau] = useState({
    nom: ''
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newId = Math.max(...niveaux.map(n => n.id)) + 1;
    const niveau = { ...newNiveau, id: newId };
    setNiveaux([...niveaux, niveau]);
    setShowAddModal(false);
    setNewNiveau({ nom: '', description: '' });
    toast.success('Niveau ajouté avec succès');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedNiveau) return;

    setNiveaux(niveaux.map(niveau => 
      niveau.id === selectedNiveau.id ? selectedNiveau : niveau
    ));
    setShowEditModal(false);
    setSelectedNiveau(null);
    toast.success('Niveau modifié avec succès');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce niveau ?')) return;
    setNiveaux(niveaux.filter(niveau => niveau.id !== id));
    toast.success('Niveau supprimé avec succès');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNiveau(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedNiveau(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-blueGray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blueGray-700">Gestion des Niveaux</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-cyan-500 text-white active:bg-cyan-600 font-bold text-xs px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        >
          <i className="fas fa-plus h-5 w-5 inline-block mr-1"></i>
          AJOUTER UN NIVEAU
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blueGray-50">
                <th className="px-6 py-3 border-b border-blueGray-200 text-left text-xs font-semibold text-blueGray-600 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 border-b border-blueGray-200 text-left text-xs font-semibold text-blueGray-600 uppercase">
                  NOM DU NIVEAU
                </th>
                <th className="px-6 py-3 border-b border-blueGray-200 text-right text-xs font-semibold text-blueGray-600 uppercase">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {niveaux.map((niveau) => (
                <tr key={niveau.id} className="hover:bg-blueGray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blueGray-700">
                    {niveau.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blueGray-700">
                    {niveau.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedNiveau(niveau);
                        setShowEditModal(true);
                      }}
                      className="text-cyan-500 hover:text-cyan-700 mx-2"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(niveau.id)}
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
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-2xl font-semibold">Ajouter un niveau</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowAddModal(false)}
                  >
                    <span className="text-black h-6 w-6 text-2xl block">×</span>
                  </button>
                </div>
                <form onSubmit={handleAdd}>
                  <div className="relative p-6 flex-auto">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Nom du niveau
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={newNiveau.nom}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>

                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => setShowAddModal(false)}
                    >
                      Annuler
                    </button>
                    <button
                      className="bg-cyan-500 text-white active:bg-cyan-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="submit"
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
      {showEditModal && selectedNiveau && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-2xl font-semibold">Modifier le niveau</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowEditModal(false)}
                  >
                    <span className="text-black h-6 w-6 text-2xl block">×</span>
                  </button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="relative p-6 flex-auto">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Nom du niveau
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={selectedNiveau.nom}
                        onChange={handleEditInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={selectedNiveau.description}
                        onChange={handleEditInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="3"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => setShowEditModal(false)}
                    >
                      Annuler
                    </button>
                    <button
                      className="bg-cyan-500 text-white active:bg-cyan-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="submit"
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
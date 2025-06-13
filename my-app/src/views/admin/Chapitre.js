import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function Chapitre() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChapitre, setSelectedChapitre] = useState(null);
  const [chapitres, setChapitres] = useState([
    { id: 1, nom: 'RLC', ordre: 1 },
    { id: 3, nom: 'RL', ordre: 3 },
    { id: 4, nom: 'RC', ordre: 4 },
    { id: 5, nom: 'Optic', ordre: 5 },
    { id: 6, nom: 'amortie', ordre: 6 },
    { id: 7, nom: 'Force mecanique', ordre: 7 }
  ]);
  const [newChapitre, setNewChapitre] = useState({
    nom: '',
    description: '',
    ordre: '',
    idNiveau: '' // Will be set based on selected level
  });

  // Handle input changes for new chapter
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChapitre(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input changes for editing chapter
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedChapitre(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new chapter
  const handleAdd = (e) => {
    e.preventDefault();
    // Add the new chapter to the list
    const newId = Math.max(...chapitres.map(c => c.id)) + 1;
    const newChap = { ...newChapitre, id: newId };
    setChapitres([...chapitres, newChap]);
    setShowAddModal(false);
    setNewChapitre({ nom: '', description: '', ordre: '', idNiveau: '' });
    toast.success('Chapitre ajouté avec succès');
  };

  // Update existing chapter
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedChapitre) return;

    // Update the chapter in the list
    const updatedChapitres = chapitres.map(chapitre =>
      chapitre.id === selectedChapitre.id ? selectedChapitre : chapitre
    );
    setChapitres(updatedChapitres);
    setShowEditModal(false);
    setSelectedChapitre(null);
    toast.success('Chapitre modifié avec succès');
  };

  // Delete chapter
  const handleDelete = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce chapitre ?')) return;
    
    // Remove the chapter from the list
    setChapitres(chapitres.filter(chapitre => chapitre.id !== id));
    toast.success('Chapitre supprimé avec succès');
  };

  return (
    <div className="flex flex-col min-h-screen bg-blueGray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blueGray-700">Gestion des Chapitres</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-cyan-500 text-white active:bg-cyan-600 font-bold text-xs px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        >
          AJOUTER UN CHAPITRE
        </button>
      </div>

      {/* Chapters Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4">
          {chapitres.map((chapitre) => (
            <div 
              key={chapitre.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">{chapitre.ordre}.</span>
                <span className="font-medium">{chapitre.nom}</span>
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
                  onClick={() => handleDelete(chapitre.id)}
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
                        name="nom"
                        value={newChapitre.nom}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Ordre
                      </label>
                      <input
                        type="number"
                        name="ordre"
                        value={newChapitre.ordre}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
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
                        name="nom"
                        value={selectedChapitre.nom}
                        onChange={handleEditInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Ordre
                      </label>
                      <input
                        type="number"
                        name="ordre"
                        value={selectedChapitre.ordre}
                        onChange={handleEditInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
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
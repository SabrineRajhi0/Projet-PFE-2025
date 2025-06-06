// src/components/Modals/EditCourseModal.js
import React from "react";

const EditCourseModal = ({ isOpen, onClose, course, onSave }) => {
  if (!isOpen || !course) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCours = {
      ...course,
      titre: e.target.titre.value,
      description: e.target.description.value,
    };
    onSave(updatedCours);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto overflow-hidden transform transition-all sm:my-8 sm:align-middle">
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">Éditer le cours</h2>
          <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors">
            <i className="fas fa-times fa-lg"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gray-50">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              id="titre"
              name="titre"
              defaultValue={course.titre}
              className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Titre du cours"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={course.description}
              rows={4}
              className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Description détaillée du cours"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;

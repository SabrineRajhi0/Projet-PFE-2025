import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/styles/courseManagement.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:8087/api/espaceCours";

const AjouterEspaceCours = () => {
  const navigate = useNavigate();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!titre.trim()) {
      toast.error("Le titre est requis");
      setIsLoading(false);
      return;
    }

    if (!description.trim()) {
      toast.error("La description est requise");
      setIsLoading(false);
      return;
    }    try {
      const token = localStorage.getItem("accessToken");
      // Using response variable to make the request but not using its value
      await axios.post(
        `${API_BASE_URL}/addEspaceCours`,
        {
          titre: titre.trim(),
          description: description.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success("Espace cours ajouté avec succès");
      navigate("/admin/MesCours");
    } catch (error) {
      console.error("Error adding course space:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout de l'espace cours");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="course-container py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-blue-600 relative">
          <div className="absolute top-0 right-0 p-2">
            <button 
              onClick={() => navigate("/admin/MesCours")}
              className="text-white/70 hover:text-white focus:outline-none transition-colors"
              title="Retour aux cours"
            >
              <i className="fas fa-times-circle text-xl"></i>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <i className="fas fa-book-open text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Ajouter un espace cours
              </h1>
              <p className="text-blue-100 mt-2">
                Renseignez les détails de l'espace cours ci-dessous
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-heading mr-2 text-indigo-500"></i>
                  Titre du cours
                </label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Entrez le titre de l'espace cours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-align-left mr-2 text-indigo-500"></i>
                  Description du cours
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32 transition-colors"
                  placeholder="Décrivez l'espace cours..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/admin/MesCours")}
                className="btn-new-cours px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center shadow-sm"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`btn-new-cours px-5 py-2.5 rounded-md shadow-md text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:scale-105"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus-circle mr-2"></i>
                    Ajouter le cours
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjouterEspaceCours;
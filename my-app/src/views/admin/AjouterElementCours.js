import React, { useState } from "react";
import { elementCoursService } from "../../Services/ElmentcoursService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/styles/courseManagement.css";

const AjouterElementCours = ({ initialData = {}, onSuccess }) => {
  // Convert numeric values to ensure they're not NaN
  const [visibleEC, setVisibleEC] = useState(Boolean(initialData.visibleEC));
  const [ordreEC, setOrdreEC] = useState(Number(initialData.ordreEC) || 1);
  const [dateLimite, setDateLimite] = useState(initialData.dateLimite || "");
  const [idespac, setIdespac] = useState(Number(initialData.idespac) || "");
  const [idTE, setIdTE] = useState(Number(initialData.idTE) || "");
  const [cheminElt, setCheminElt] = useState(null);
  const [description, setDescription] = useState(initialData.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const idEC = initialData.idEC;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!cheminElt && !idEC) {
      toast.error("Veuillez sélectionner un fichier.");
      setIsLoading(false);
      return;
    }

    // Validate numeric fields
    if (!ordreEC || isNaN(ordreEC)) {
      toast.error("L'ordre doit être un nombre valide");
      setIsLoading(false);
      return;
    }

    if (!idespac || isNaN(idespac)) {
      toast.error("L'ID de l'espace cours doit être un nombre valide");
      setIsLoading(false);
      return;
    }

    if (!idTE || isNaN(idTE)) {
      toast.error("Veuillez sélectionner un type d'élément");
      setIsLoading(false);
      return;
    }

    try {
      const data = {
        visibleEC,
        ordreEC: Number(ordreEC),
        dateLimite,
        idespac: Number(idespac),
        idTE: Number(idTE),
        description,
        file: cheminElt,
      };

      if (idEC) {
        await elementCoursService.updateElementCours(idEC, data);
      } else {
        await elementCoursService.addElementCours(data);
      }
      onSuccess?.();
    } catch (error) {
      toast.error(`Erreur : ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-800">
          <h1 className="text-2xl font-bold text-white">
            {idEC ? "Modifier l'élément de cours" : "Ajouter un élément de cours"}
          </h1>
          <p className="text-blue-100 mt-2">
            Renseignez les détails de l'élément de cours ci-dessous
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-n, ;<
          -6">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="visible"
                  checked={visibleEC}
                  onChange={(e) => setVisibleEC(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="visible" className="text-sm font-medium text-gray-700">
                  Visible pour les étudiants
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Espace Cours
                </label>
                <input
                  type="number"
                  value={idespac || ""}
                  onChange={(e) => setIdespac(e.target.value ? Number(e.target.value) : "")}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre
                </label>
                <input
                  type="number"
                  value={ordreEC || ""}
                  onChange={(e) => setOrdreEC(e.target.value ? Number(e.target.value) : "")}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Limite
                </label>
                <input
                  type="date"
                  value={dateLimite}
                  onChange={(e) => setDateLimite(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'Élément
                </label>
                <select
                  value={idTE}
                  onChange={(e) => setIdTE(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Choisir un type --</option>
                  <option value="1">Image</option>
                  <option value="2">PDF</option>
                  <option value="4">Document</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                placeholder="Décrivez le contenu de cet élément..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Téléverser un fichier</span>
                      <input
                        type="file"
                        onChange={(e) => setCheminElt(e.target.files[0])}
                        required={!idEC}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {cheminElt ? cheminElt.name : "PDF, DOCX, JPG, MP4 (Max. 10MB)"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {idEC ? "Modifier l'Élément" : "Ajouter l'Élément"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 px-8 py-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Conseils pour ajouter des éléments de cours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Description claire</span>
              </div>
              <p className="text-sm text-gray-600">
                Utilisez des descriptions claires pour aider les étudiants à identifier le contenu
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Dates limites</span>
              </div>
              <p className="text-sm text-gray-600">
                Vérifiez les dates limites pour éviter les erreurs de planning
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Organisation</span>
              </div>
              <p className="text-sm text-gray-600">
                Organisez les éléments dans l'ordre logique de consultation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjouterElementCours;
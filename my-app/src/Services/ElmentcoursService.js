import axios from 'axios';
import { toast } from 'react-toastify';

// Configuration de base
const API_BASE_URL = 'http://localhost:8087/api/element-cours';
const UPLOADS_BASE_URL = 'http://localhost:8087/uploads';

// Helper pour gérer l'authentification
const getAuthConfig = (isMultipart = false) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token available');
  }
  
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isMultipart ? {} : { 'Content-Type': 'application/json' })
    }
  };
};

// Helper pour gérer les erreurs API
const handleApiError = (error, customMessage) => {
  console.error('API Error:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });

  if (error.response?.status === 401) {
    toast.error('Session expirée. Veuillez vous reconnecter.');
    // Redirect handling should be done at component level
    throw new Error('Session expired');
  }

  if (error.response?.status === 403) {
    toast.error('Accès non autorisé. Veuillez vérifier vos permissions.');
    throw new Error('Unauthorized access');
  }

  toast.error(error.response?.data?.message || customMessage);
  throw error;
};

// Service pour les éléments de cours
export const elementCoursService = {
  // Récupérer tous les éléments de cours
  getAllElementCours: async () => {
    try {
      console.log('Fetching element cours...');
      const response = await axios.get(`${API_BASE_URL}/getAllElementCours`, getAuthConfig());
      
      console.log('Raw API Response:', response.data);
      
      // Ensure data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      
      // Log the first item structure if available
      if (data.length > 0) {
        console.log('First Element Structure:', {
          id: data[0].idEC,
          visible: data[0].visibleEC,
          ordre: data[0].ordreEC,
          element: data[0].element,
          typeElement: data[0].element?.typeElement,
          description: data[0].element?.desElt
        });
      }
      
      return data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la récupération des éléments de cours');
    }
  },

  // Récupérer un élément de cours par ID
  getElementCoursById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getElementCours/${id}`, getAuthConfig());
      return response.data;
    } catch (error) {
      handleApiError(error, `Erreur lors de la récupération de l'élément ${id}`);
      throw error;
    }
  },

  // Préparer les données pour le formulaire
  prepareFormData: (data) => {
    console.log('Received data in prepareFormData:', data);
    
    if (!data || typeof data !== 'object') {
      throw new Error('Les données fournies sont invalides');
    }

    const formData = new FormData();
    
    // Validation et ajout des champs de base
    if (typeof data.visibleEC === 'undefined') {
      data.visibleEC = true; // valeur par défaut
    }
    formData.append('visibleEC', Boolean(data.visibleEC).toString());
    
    if (typeof data.ordreEC === 'undefined') {
      data.ordreEC = 0; // valeur par défaut
    }
    formData.append('ordreEC', Math.max(0, parseInt(data.ordreEC) || 0).toString());
    
    // Formater la date si nécessaire
    if (data.dateLimite) {
      try {
        const date = new Date(data.dateLimite);
        if (!isNaN(date.getTime())) {
          formData.append('dateLimite', date.toISOString().split('T')[0]);
        } else {
          formData.append('dateLimite', '');
        }
      } catch (e) {
        console.warn('Invalid date format:', data.dateLimite);
        formData.append('dateLimite', '');
      }
    } else {
      formData.append('dateLimite', '');
    }
    
    // Validation des IDs
    if (!data.idespac) {
      console.error('Missing idespac:', data);
      throw new Error("L'ID de l'espace cours est requis");
    }
    formData.append('idespac', String(data.idespac));
    
    if (!data.idTE) {
      console.error('Missing idTE:', data);
      throw new Error("L'ID du type d'élément est requis");
    }
    formData.append('idTE', String(data.idTE));
    
    // Ajouter la description
    formData.append('des_elt', data.description || '');
    
    // Validation et ajout du fichier
    if (!data.file) {
      console.error('Missing file:', data);
      throw new Error('Le fichier est requis');
    }
    
    if (!(data.file instanceof File)) {
      console.error('Invalid file type:', typeof data.file);
      throw new Error('Le fichier doit être un objet File valide');
    }
    
    formData.append('chemin_elt', data.file);
    
    // Log pour le débogage
    console.log('FormData préparé avec les champs suivants:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }
    
    return formData;
  },

  // Ajouter un élément de cours avec fichier
  addElementCours: async (data) => {
    try {
      // Si data est déjà un FormData, l'utiliser directement
      const formData = data instanceof FormData ? data : elementCoursService.prepareFormData(data);
      
      const response = await axios.post(
        `${API_BASE_URL}/addElementCours`,
        formData,
        {
          ...getAuthConfig(),
          headers: {
            ...getAuthConfig().headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'ajout de l\'élément');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'élément');
    }
  },

  // Mettre à jour un élément de cours
  updateElementCours: async (id, data) => {
    try {
      // Build multipart form data for update with optional fields
      const formData = new FormData();
      if (typeof data.visibleEC !== 'undefined') {
        formData.append('visibleEC', Boolean(data.visibleEC).toString());
      }
      if (typeof data.ordreEC !== 'undefined') {
        formData.append('ordreEC', String(data.ordreEC));
      }
      if (data.dateLimite) {
        formData.append('dateLimite', data.dateLimite);
      }
      if (typeof data.idTE !== 'undefined') {
        formData.append('idTE', String(data.idTE));
      }
      if (data.description) {
        formData.append('des_elt', data.description);
      }
      if (data.file) {
        formData.append('chemin_elt', data.file);
      }
      const config = getAuthConfig(true);
      const response = await axios.put(
        `${API_BASE_URL}/updateElementCours/${id}`,
        formData,
        config
      );
      toast.success('Élément mis à jour avec succès');
      return response.data;
    } catch (error) {
      handleApiError(error, `Erreur lors de la mise à jour de l'élément ${id}`);
      throw error;
    }
  },

  // Supprimer un élément de cours
  deleteElementCours: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteElementCours/${id}`, getAuthConfig());
      toast.success('Élément supprimé avec succès');
      return response.data;
    } catch (error) {
      handleApiError(error, `Erreur lors de la suppression de l'élément ${id}`);
      throw error;
    }
  },

  // Télécharger un fichier
  downloadFile: async (filename) => {
    try {
      const response = await axios.get(`${UPLOADS_BASE_URL}/elements/${filename}`, {
        ...getAuthConfig(),
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      handleApiError(error, `Erreur lors du téléchargement du fichier ${filename}`);
      throw error;
    }
  }
};

// Helper pour déterminer le type de fichier
export const fileTypeHelper = {
  getFileType: (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'document';
     
      default:
        return 'other';
    }
  },
  
  getIcon: (fileType) => {
    switch (fileType) {
      case 'image': return '🖼️';
      case 'pdf': return '📄';
      case 'document': return '📝';
      
      default: return '📁';
    }
  }
};
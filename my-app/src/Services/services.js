import axios from 'axios';

// Define base URLs
const BASE_API_URL = 'http://localhost:8087/api';
const BASE_API_URL1 = 'http://localhost:8087';
const BASE_API_URL2 = 'http://localhost:8087/api/element';

const BASE_API_URL3 = 'http://localhost:8087/api/element-cours';

// Helper function to get the token
const getToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error('Aucun token d\'authentification trouvé');
    window.location.href = '/auth/login';
    return null;
  }
  return token;
};

// Fetch espaces de cours with elements
export const fetchEspacesCoursWithElements = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  try {
    const response = await axios.get(
      "http://localhost:8087/api/espaceCours/getAllEspaceCours",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data || []; // Return empty array if data is undefined
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Access denied: Invalid or expired token");
    }
    throw error;
  }
};

// Upload element
const uploadElement = async (file, desElt, typeElementId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('desElt', desElt);
  formData.append('typeElementId', typeElementId);

  try {
    const response = await axios.post(`${BASE_API_URL}/element/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors du téléchargement.');
  }
};

// File utility functions
export const fileService = {
  determineFileType: (filename) => {
    const lowerCaseFilename = filename.toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif'].some(ext => lowerCaseFilename.endsWith(ext))) return 'Image';
    else if (lowerCaseFilename.endsWith('.pdf')) return 'PDF';
    else if (['.mp4', '.webm'].some(ext => lowerCaseFilename.endsWith(ext))) return 'Video';
    else if (lowerCaseFilename.endsWith('.docx')) return 'Document Word';
    return 'UNKNOWN';
  },

getContentType: (fileType, filename) => {
  const lowerCaseFilename = filename.toLowerCase();
  switch (fileType) {
    case 'Image':
      if (lowerCaseFilename.endsWith('.jpg') || lowerCaseFilename.endsWith('.jpeg')) return 'image/jpeg';
      else if (lowerCaseFilename.endsWith('.png')) return 'image/png';
      else if (lowerCaseFilename.endsWith('.gif')) return 'image/gif';
      break;
    case 'PDF': return 'application/pdf';
    case 'Video':
      if (lowerCaseFilename.endsWith('.mp4')) return 'video/mp4';
      else if (lowerCaseFilename.endsWith('.webm')) return 'video/webm';
      break;
    case 'Document Word': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return 'application/octet-stream';
  }
},


  shouldDisplayInline: (fileType) => ['Image', 'PDF', 'Document Word'].includes(fileType),

  getFile: async (filename) => {
    const token = getToken();
    if (!token) return { success: false, error: 'Aucun token d\'authentification trouvé' };

    try {
      const response = await axios.get(`${BASE_API_URL1}/uploads/elements/${encodeURIComponent(filename)}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}`, Origin: 'http://localhost:3000' },
      });

      const fileType = fileService.determineFileType(filename);
      const contentType = fileService.getContentType(fileType, filename);

      return {
        success: true,
        data: response.data,
        contentType,
        filename,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du fichier :', {
        message: error.message,
        status: error.response?.status,
        filename,
      });
      return { success: false, error: error.message };
    }
  },

  handleFile: async (filename) => {
    const result = await fileService.getFile(filename);
    if (!result.success) return result;

    const fileType = fileService.determineFileType(filename);
    const shouldInline = fileService.shouldDisplayInline(fileType);

    const blob = new Blob([result.data], { type: result.contentType });
    const url = window.URL.createObjectURL(blob);

    if (shouldInline) {
      return { success: true, action: 'preview', url, type: result.contentType };
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true, action: 'download' };
    }
  },

  downloadFile: async (docId) => {
    const token = getToken();
    if (!token) return { success: false, message: 'Aucun token d\'authentification trouvé' };

    try {
      const response = await axios.get(`${BASE_API_URL2}/${docId}/download`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: 'http://localhost:3000',
        },
      });

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `file-${docId}`; // Fallback filename
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, ''); // Clean filename
        }
      }

      // Create blob and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, message: 'Fichier téléchargé avec succès', filename: fileName };
    } catch (error) {
      console.error('Erreur lors du téléchargement :', error);
      let errorMessage = 'Échec du téléchargement du fichier';
      if (error.response) {
        if (error.response.status === 404) errorMessage = 'Fichier non trouvé sur le serveur';
        else if (error.response.status === 403) errorMessage = 'Permission refusée : Vous n\'avez pas les droits nécessaires';
        else if (error.response.status === 401) errorMessage = 'Authentification échouée. Veuillez vous reconnecter.';
      }
      return { success: false, message: errorMessage };
    }
  },

  
  // Ajouter un élément de cours avec token d'authentification
addElementCour: async (elementCour) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error("Aucun token d'authentification trouvé");
    throw new Error("Token manquant. Veuillez vous reconnecter.");
  }

  try {
    const response = await axios.post(
      `${BASE_API_URL3}/add`,
      elementCour,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'élément de cours :", error);
    throw error;
  }
},
  getAllElementCour: async () => {
    const token = getToken();
    try {
      const response = await axios.get(`${BASE_API_URL3}/getAllElementCours`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des éléments de cours :', error);
      throw error;
    }
  },


   deleteElementCour: async (idEC) => {
    const token = getToken();
    try {
      const response = await axios.delete(`${BASE_API_URL3}/delete/${idEC}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément de cours :', error);
      throw error;
    }
  },

  updateElementCour: async (idEC, formData) => {
    const token = getToken();
    try {
      const response = await axios.put(`${BASE_API_URL3}/updateElementCours/${idEC}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      throw error;
    }
  },



};

// CRUD operations for element-cours
// export const getAllElementCour = async () => {
//   try {
//     const response = await axios.get(`${BASE_API_URL3}/getAllElementCours`);
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors de la récupération des éléments de cours :', error);
//     throw error;
//   }
// };

export const addElementCour = async (elementCour) => {
  try {
    const response = await axios.post(`${BASE_API_URL3}/add`, elementCour);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'élément de cours :', error);
    throw error;
  }
};

export const deleteElementCour = async (idEC) => {
  try {
    const response = await axios.delete(`${BASE_API_URL3}/delete/${idEC}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élément de cours :', error);
    throw error;
  }
};

// Ajouter un élément de cours
export const ajouterElementCours = async (data) => {
  try {
    const response = await axios.post(`${BASE_API_URL3}/addElementCours`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Mettre à jour un élément de cours
export const updateElementCours = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_API_URL3}/updateElementCours/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour');
  }
};

export { uploadElement }; 
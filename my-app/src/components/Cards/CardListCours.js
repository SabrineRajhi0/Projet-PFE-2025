import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {  useNavigate  } from 'react-router-dom';


import { fetchEspacesCoursWithElements, fileService } from '../../Services/services';
import { elementCoursService } from '../../Services/ElmentcoursService';

const CardListCours = () => {
  const location = useLocation();
  const userRole = location.state?.userRole || 'apprenant'; // Reverted: Original userRole logic
  console.log(`[CardListCours] Current userRole: ${userRole}, Location state:`, location.state); // Reverted: Original debug line

  const navigate = useNavigate();
  
  const [cours, setCours] = useState([]);
  const [file, setFile] = useState(null);
  const [desElt, setDesElt] = useState('');
  const [typeElementId, setTypeElementId] = useState('');
  const [espaceCoursId, setEspaceCoursId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCours, setSelectedCours] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [typeElements, setTypeElements] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [elements, setElements] = useState([]);

  const [editCoursData, setEditCoursData] = useState({
    titre: '',
    description: ''
  });
 


  
  useEffect(() => {
    
    fetch('http://localhost:8087/api/type-element/getAllTypeElements')
      .then(res => res.json())
      .then(setTypeElements)
      .catch(console.error);

    fetchEspacesCoursWithElements()
      .then(setCours)
      .catch(console.error);
  }, [userRole]);

  useEffect(() => {
    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleOpenCours = (coursItem) => {
    setSelectedCours(coursItem);
    setElements(coursItem.elementsCours || []);
    setSelectedElement(null);
    setPreviewUrl(null);
    setShowViewModal(true);
  };

  const handleSubmitCours = async (e) => {
    e.preventDefault();
    if (!espaceCoursId) return alert('Veuillez sélectionner un cours');

    try {
      const formData = {
        visibleEC: true,
        ordreEC: 0,
        dateLimite: null,
        idespac: parseInt(espaceCoursId),
        idTE: parseInt(typeElementId),
        description: desElt,
        file: file
      };

      const response = await elementCoursService.addElementCours(formData);
      
      if (response.status === 'success') {
        const updated = await fetchEspacesCoursWithElements();
        setCours(updated);
        alert('Succès : Élément ajouté !');
        setShowAddModal(false);
        setDesElt('');
        setTypeElementId('');
        setEspaceCoursId('');
        setFile(null);
      } else {
        throw new Error(response.message || 'Erreur lors de l\'ajout de l\'élément');
      }
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  const handleFileAction = async (element) => {
    if (!element?.element?.cheminElt) return alert('Aucun fichier disponible');

    const filename = element.element.cheminElt.split('/').pop();
    const result = await fileService.handleFile(filename);

    if (result.success) {
      if (element.element.typeElement?.idTE === 5) {
        const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(result.url)}`;
        window.open(officeUrl, '_blank');
      } else if (result.action === 'preview') {
        if (previewUrl) window.URL.revokeObjectURL(previewUrl);
        setPreviewUrl(result.url);
      }
    } else {
      alert('Erreur fichier : ' + result.error);
    }
  };

  const handleShare = async (element) => {
    if (!element?.element?.cheminElt) return alert('Aucun fichier à partager');

    const filename = element.element.cheminElt.split('/').pop();
    const result = await fileService.getFile(filename);

    if (result.success) {
      const blob = new Blob([result.data], { type: result.contentType });
      const url = window.URL.createObjectURL(blob);
      if (navigator.share) {
        try {
          await navigator.share({ title: element.element.desElt, url });
        } catch (err) {
          alert('Partage échoué');
        } finally {
          window.URL.revokeObjectURL(url);
        }
      } else {
        alert('Partage non supporté');
      }
    } else {
      alert('Erreur partage : ' + result.error);
    }
  };

  const handleDownload = async () => {
    if (!selectedElement?.element?.cheminElt) return alert('Fichier non trouvé');

    setIsDownloading(true);
    try {
      const filename = selectedElement.element.cheminElt.split('/').pop();
      const result = await fileService.downloadFile(filename);

      if (!result.success) throw new Error(result.error);
    } catch (error) {
      alert(`Échec téléchargement : ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteCours = async (coursId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;
    
    try {
      const response = await fetch(`http://localhost:8087/api/espaceCours/deleteEspaceCours/${coursId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      setCours(cours.filter(c => c.idespac !== coursId));
      alert('Cours supprimé avec succès');
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const handleNavigateToEditCours = (coursItem) => {
    navigate(`/modifier/${coursItem.idespac}`, { state: { coursItem } });
    console.log("id",coursItem)
  };
  

  const handleUpdateCours = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8087/api/espaceCours/updateEspaceCours/${editCoursData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre: editCoursData.titre,
          description: editCoursData.description
        })
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      const updated = await fetchEspacesCoursWithElements();
      setCours(updated);
      setShowEditModal(false);
      alert('Cours mis à jour avec succès');
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  return (
    <div className="mescours-container course-container"> {/* Added course-container for global styling */}
      <div className="mescours-header">
        <p className="mescours-welcome">Bienvenue sur la page de vos cours.</p>

           {userRole === 'admin' && (
          <button onClick={() => setShowAddModal(true)} className="btn-add-cours"> {/* Added class */}

          Ajouter cours
        </button>
      )}
      </div>

         {/* Tableau des cours */}
      <table className="cours-table">
        <thead>
          <tr>
            <th>ID</th>
            {/* <th>Icon</th> */}
            <th>Titre</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

  {cours.map((coursItem) => (
    <tr key={coursItem.idespac}>
      <td>{coursItem.idespac}</td>
      {/*<td>
        <img src=\"/path/to/course-icon.png\" alt=\"Course Icon\" className=\"course-icon\" /> 
      </td>*/}
      <td>{coursItem.titre}</td>
      <td>{coursItem.description}</td>
     
              <td>
                {(userRole === 'apprenant' || userRole === 'enseignant') && (
                  <button onClick={() => handleOpenCours(coursItem)} className="btn-open-cours">Ouvrir</button> /* Added class */
                )}
                {userRole === 'admin' && (
                  <>
                    <button onClick={() => handleNavigateToEditCours(coursItem)} className="btn-edit-cours">Modifier</button> {/* Added class */}
                    <button onClick={() => handleDeleteCours(coursItem.idespac)} className="btn-delete-cours">Supprimer</button> {/* Added class */}
                  </>
                )}
              </td>
    </tr>
  ))}
</tbody>

      </table>

      {userRole === 'admin' && (
        <>
          {showAddModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <form onSubmit={handleSubmitCours}>
                  <select value={espaceCoursId} onChange={(e) => setEspaceCoursId(e.target.value)} required>
                    <option value="">-- Sélectionner un cours --</option>
                    {cours.map(c => <option key={c.idespac} value={c.idespac}>{c.titre}</option>)}
                  </select>
                  <input type="file" accept="image/*,video/*,application/pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} required />
                  <input type="text" placeholder="Description" value={desElt} onChange={(e) => setDesElt(e.target.value)} required />
                  <select value={typeElementId} onChange={(e) => setTypeElementId(e.target.value)} required>

                    <option value="">-- Type --</option>
                    {typeElements.map(type => <option key={type.idTE} value={type.idTE}>{type.nomTE}</option>)}
                  </select>
                  <div>
                    {typeElementId === '2' && <img src="/pdf-icon.png" alt="" />}
                    {/* {typeElementId === '4' && <img src="/word-icon.png" alt="" />} */}
                    {typeElementId === '5' && <img src="/word-icon.png" alt="" />}
                    {typeElementId === '1' && <img src="/image-icon.png" alt="" />}
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="bouton-confirmer-modal">Envoyer</button> {/* Added class */}



                    <button type="button" onClick={() => setShowAddModal(false)} className="bouton-annuler-modal">Annuler</button> {/* Added class */}
                  </div>
                </form>
              </div>
            </div>
          )}

          {showEditModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Modifier le cours</h2>
                <form onSubmit={handleUpdateCours}>
                  <input 
                    type="text" 
                    placeholder="Titre" 
                    value={editCoursData.titre} 
                    onChange={(e) => setEditCoursData({...editCoursData, titre: e.target.value})} 
                    required 
                  />
                  <textarea 
                    placeholder="Description" 
                    value={editCoursData.description} 
                    onChange={(e) => setEditCoursData({...editCoursData, description: e.target.value})} 
                    required 
                  />
                  <div className="modal-actions">
                    <button type="submit" className="bouton-confirmer-modal">Mettre à jour</button> {/* Added class */}
                    <button type="button" onClick={() => setShowEditModal(false)} className="bouton-annuler-modal">Annuler</button> {/* Added class */}
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {showViewModal && (
        <div className="modal-overlay">
          <div className="modal-view-content">
            <div className="modal-header">
              <h2>Documents pour {selectedCours?.titre}</h2>
              <button onClick={() => setShowViewModal(false)} >✕</button> {/* Removed btn-close-modal, rely on modal-header button style or add specific if needed */}
            </div>
            <div className="modal-body">
              <div className="document-list">
                {elements.length > 0 ? elements.map((element) => (
                  <div
                    key={element.idEC}
                    className={`document-item ${selectedElement?.idEC === element.idEC ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedElement(element);
                      handleFileAction(element);
                    }}
                  >
                    <img src="/path/to/document-icon.png" alt="" />
                    <div>
                      <p>{element.element.desElt}</p>
                      <p>Type: {element.element.typeElement?.nomTE}</p>
                      <p>Ajout: {new Date(element.dateAjoutEC).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : <p>Aucun document.</p>}
              </div>

              <div className="document-preview">
                {selectedElement ? (
                  <>
                    <div className="preview-header">
                      <h3>{selectedElement.element.desElt}</h3>
                      <div className="preview-actions">
                        <button onClick={handleDownload} disabled={isDownloading} > {/* Removed specific class, covered by .preview-actions button */}
                          {isDownloading ? 'Téléchargement...' : '↓ Télécharger'}
                        </button>
                        {navigator.share && (
                          <button onClick={() => handleShare(selectedElement)} > {/* Removed specific class, covered by .preview-actions button */}
                            Partager
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="preview-content">
                      {previewUrl && selectedElement.element.typeElement?.idTE === 2 && (
                        <embed src={previewUrl} type="application/pdf" width="100%" height="500px" />
                      )}
                      {previewUrl && selectedElement.element.typeElement?.idTE === 1 && (
                        <img src={previewUrl} alt="Aperçu" className="preview-image" />
                      )}
                      {previewUrl && selectedElement.element.typeElement?.idTE === 4 && (
                        <iframe src={previewUrl} width="100%" height="500px" title="Word Preview" />
                      )}
                    </div>
                  </>
                ) : <p>Sélectionnez un document.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardListCours;
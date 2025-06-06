package GestionCours.backend.springboot.Services;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import org.springframework.transaction.annotation.Transactional;

import GestionCours.backend.springboot.Entity.EspaceCours;
import GestionCours.backend.springboot.Exception.EspaceCoursException;
import GestionCours.backend.springboot.Repositrory.EspaceCoursRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EspaceCoursServiceimpL implements EspaceCoursServiceInterface {

    private static final Logger log = LoggerFactory.getLogger(EspaceCoursServiceimpL.class);

    @Autowired
    private EspaceCoursRepository espacecoursRepository;

    // Constructor for dependency injection
    public EspaceCoursServiceimpL(EspaceCoursRepository espacecoursRepository) {
        this.espacecoursRepository = espacecoursRepository;
    }

    // Get all courses
    @Override
    public List<EspaceCours> getAllespacecours() {
        List<EspaceCours> espaceCoursList = espacecoursRepository.findAll();
        if (espaceCoursList.isEmpty()) {
            throw new EspaceCoursException("Aucun espace de cours trouvé");
        }
        return espaceCoursList;
    }

    // Add a new course
    @Override
    public EspaceCours addEspace(EspaceCours espaceCours) {
        // Validation des champs obligatoires
        if (espaceCours.getTitre() == null || espaceCours.getTitre().trim().isEmpty()) {
            throw new EspaceCoursException("Le titre de l'espace de cours est requis");
        }
        if (espaceCours.getDescription() == null || espaceCours.getDescription().trim().isEmpty()) {
            throw new EspaceCoursException("La description de l'espace de cours est requise");
        }
        // Validation de la longueur maximale
        if (espaceCours.getTitre().length() > 255) {
            throw new EspaceCoursException("Le titre de l'espace de cours ne doit pas dépasser 255 caractères");
        }
        if (espaceCours.getDescription().length() > 1000) {
            throw new EspaceCoursException("La description de l'espace de cours ne doit pas dépasser 1000 caractères");
        }

        try {
            return espacecoursRepository.save(espaceCours);
        } catch (Exception e) {
            throw new EspaceCoursException("Erreur lors de l'ajout de l'espace de cours : " + e.getMessage(), e);
        }
    }

    // Get a course by ID
    @Override
    public EspaceCours getEspaceCoursById(long id) {
        return espacecoursRepository.findById(id)
                .orElseThrow(() -> new EspaceCoursException("Espace de cours avec ID " + id + " non trouvé"));
    }

    // Update an existing course by ID
    @Override
    public EspaceCours updateEspaceCours(long id, EspaceCours espaceCours) {
        // Vérifier si l'espace de cours existe avant de le mettre à jour
        EspaceCours existing = espacecoursRepository.findById(id)
                .orElseThrow(() -> new EspaceCoursException("Espace de cours avec ID " + id + " non trouvé"));

        // Validation des champs obligatoires
        if (espaceCours.getTitre() == null || espaceCours.getTitre().trim().isEmpty()) {
            throw new EspaceCoursException("Le titre de l'espace de cours est requis");
        }
        if (espaceCours.getDescription() == null || espaceCours.getDescription().trim().isEmpty()) {
            throw new EspaceCoursException("La description de l'espace de cours est requise");
        }
        // Validation de la longueur maximale
        if (espaceCours.getTitre().length() > 255) {
            throw new EspaceCoursException("Le titre de l'espace de cours ne doit pas dépasser 255 caractères");
        }
        if (espaceCours.getDescription().length() > 1000) {
            throw new EspaceCoursException("La description de l'espace de cours ne doit pas dépasser 1000 caractères");
        }

        // Mettre à jour les champs
        existing.setTitre(espaceCours.getTitre());
        existing.setDescription(espaceCours.getDescription());

        // Sauvegarder les modifications
        try {
            return espacecoursRepository.save(existing);
        } catch (Exception e) {
            throw new EspaceCoursException("Erreur lors de la mise à jour de l'espace de cours : " + e.getMessage(), e);
        }
    }

    // Delete a course by ID
    @Override
    public void deleteEspaceCours(long id) {
        // Vérifier si l'espace de cours existe avant de le supprimer
        if (!espacecoursRepository.existsById(id)) {
            throw new EspaceCoursException("Espace de cours avec ID " + id + " non trouvé");
        }
        try {
            espacecoursRepository.deleteById(id);
        } catch (Exception e) {
            throw new EspaceCoursException("Erreur lors de la suppression de l'espace de cours : " + e.getMessage(), e);
        }
    }

	@Override
	public EspaceCours getEspaceCoursById(Long id) {
	
		return espacecoursRepository.findById(id)
                .orElseThrow(() -> new EspaceCoursException("Espace de cours avec ID " + id + " non trouvé"));
	}
	
	
	  @Transactional(readOnly = true)
	    public List<EspaceCours> getAllWithElements() {
	        return espacecoursRepository.findAllWithElements();
	    }
	
    @Override
    @Transactional
    public void deleteAllAndResetSequence() {
        try {
            log.info("Deleting all courses and resetting sequence");
            espacecoursRepository.deleteAllAndResetSequence();
            log.info("Successfully deleted all courses and reset sequence");
        } catch (Exception e) {
            log.error("Error deleting all courses and resetting sequence: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete all courses and reset sequence: " + e.getMessage());
        }
    }
	
	
	
	
	
	
	
}
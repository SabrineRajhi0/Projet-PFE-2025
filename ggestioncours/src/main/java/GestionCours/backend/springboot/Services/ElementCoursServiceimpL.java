package GestionCours.backend.springboot.Services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import java.nio.file.Path;
import java.io.InputStream;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import GestionCours.backend.springboot.Controllers.ElementCoursController;
import GestionCours.backend.springboot.DTO.AjouterElementDTO;
import GestionCours.backend.springboot.Entity.Element;
import GestionCours.backend.springboot.Entity.ElementCours;
import GestionCours.backend.springboot.Entity.EspaceCours;
import GestionCours.backend.springboot.Entity.TypeElement;
import GestionCours.backend.springboot.Exception.ElementCoursException;
import GestionCours.backend.springboot.Repositrory.ElementCoursRepository;
import GestionCours.backend.springboot.Repositrory.ElementRepository;
import GestionCours.backend.springboot.Repositrory.EspaceCoursRepository;
import GestionCours.backend.springboot.Repositrory.TypeElementRepository;

@Service
@Transactional
public class ElementCoursServiceimpL implements ElementCoursServiceInterface {

    @Autowired
    private ElementRepository elementRepository;

    @Autowired
    private TypeElementRepository typeElementRepository;

    @Autowired
    private ElementCoursRepository elementCoursRepository;
    
    @Autowired
    private EspaceCoursRepository espacecoursRepository;
    
    
    private static final Logger log = LoggerFactory.getLogger(ElementCoursController.class);
    
    private static final String UPLOAD_DIR = "uploads/elements/";
    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        log.info("Upload directory initialized at: {}", UPLOAD_DIR);
    }
    // Récupérer tous les éléments de cours
	@Override
	@Transactional
	public List<ElementCours> getAllElementCours() {
        try {
            log.info("Fetching all ElementCours with details");
            List<ElementCours> elementCoursList = elementCoursRepository.findAllWithDetails();
            
            if (elementCoursList == null) {
                log.warn("Repository returned null list");
                return List.of();
            }
            
            log.info("Found {} ElementCours records", elementCoursList.size());
            
            // Validate each element to ensure data integrity
            elementCoursList.forEach(ec -> {
                if (ec.getElement() != null) {
                    log.debug("Element has type: {}", 
                        ec.getElement().getTypeElement() != null ? 
                            ec.getElement().getTypeElement().getNomTE() : "null");
                }
            });
            
            return elementCoursList;
        } catch (Exception e) {
            log.error("Error fetching ElementCours list: {}", e.getMessage(), e);
            if (e instanceof EntityNotFoundException) {
                throw new ElementCoursException("No elements found in the database");
            } else if (e instanceof jakarta.persistence.PersistenceException) {
                throw new ElementCoursException("Database error while fetching elements");
            }
            throw new ElementCoursException("Failed to fetch ElementCours list: " + e.getMessage());
        }
	}
	/*
	
	// Ajouter un élément de cours
	@Override
	public ElementCours addElementCours(ElementCours elementCours) {
		// Valider les champs (dateAjoutEC est défini automatiquement via @PrePersist)
        validateElementCours(elementCours, false);
        return elementCoursRepository.save(elementCours);

	}*/
	
	 // Récupérer un élément de cours par ID
	@Override
	public ElementCours getElementCoursById(Long id) {
		return elementCoursRepository.findById(id)
                .orElseThrow(() -> new ElementCoursException("Élément de cours avec ID " + id + " non trouvé"));

	}
     /*
	
	// Mettre à jour un élément de cours
	@Override
	public ElementCours updateElementCours(Long id, ElementCours elementCours) {
		ElementCours existing = getElementCoursById(id); // Lève une exception si non trouvé
        validateElementCours(elementCours, true);

        // Mettre à jour les champs
        existing.setVisibleEC(elementCours.isVisibleEC());
        existing.setOrdreEC(elementCours.getOrdreEC());
        // Ne pas modifier dateAjoutEC lors de la mise à jour (elle reste celle de la création)
        existing.setDateLimiteEC(elementCours.getDateLimiteEC());
        existing.setEspaceCours(elementCours.getEspaceCours());
        existing.setElement(elementCours.getElement());

        return elementCoursRepository.save(existing);
	}

	
	 // Supprimer un élément de cours
	@Override
	public void deleteElementCours(Long id) {
		ElementCours elementCours = getElementCoursById(id); // Lève une exception si non trouvé
        elementCoursRepository.deleteById(id);

		
	}
	
	/*

    	// Méthode de validation commune pour ajout et mise à jour
        private void validateElementCours(ElementCours elementCours, boolean isUpdate) {
            // Validation des champs
            if (elementCours == null) {
                throw new ElementCoursException("L'objet ElementCours ne peut pas être null");
            }

            if (elementCours.getOrdreEC() < 0) {
                throw new ElementCoursException("L'ordre de l'élément de cours ne peut pas être négatif");
            }

            // Vérifier que dateLimiteEC n'est pas antérieure à dateAjoutEC
            // Note : dateAjoutEC sera défini via @PrePersist pour l'ajout, mais pas encore ici
            if (elementCours.getDateLimiteEC() != null && !isUpdate) {
                LocalDate dateAjoutEC = LocalDate.now(); // Simuler la date qui sera définie
                if (elementCours.getDateLimiteEC().isBefore(dateAjoutEC)) {
                    throw new ElementCoursException("La date limite ne peut pas être antérieure à la date d'ajout");
                }
            } else if (elementCours.getDateLimiteEC() != null && elementCours.getDateAjoutEC() != null) {
                if (elementCours.getDateLimiteEC().isBefore(elementCours.getDateAjoutEC())) {
                    throw new ElementCoursException("La date limite ne peut pas être antérieure à la date d'ajout");
                }
            }

            // Validation de l'espace de cours et de l'élément
            if (elementCours.getEspaceCours() == null) {
                throw new ElementCoursException("L'espace de cours est requis pour l'élément de cours");
            }

            if (elementCours.getElement() == null) {
                throw new ElementCoursException("L'élément est requis pour l'élément de cours");
            }
        }*/


		@Override
		public ElementCours updateElementCours(Long id, boolean visibleEC, int ordreEC, LocalDate dateLimiteEC,
				EspaceCours espaceCours, Element element) {
			
			ElementCours existing = getElementCoursById(id); // Lève une exception si non trouvé
            
            // Validation des données
            if (ordreEC < 0) {
                throw new ElementCoursException("L'ordre de l'élément de cours ne peut pas être négatif");
            }
            
            if (espaceCours == null) {
                throw new ElementCoursException("L'espace de cours est requis pour l'élément de cours");
            }
            
            if (element == null) {
                throw new ElementCoursException("L'élément est requis pour l'élément de cours");
            }
            
            // Mettre à jour les champs
            existing.setVisibleEC(visibleEC);
            existing.setOrdreEC(ordreEC);
            // Ne pas modifier dateAjoutEC lors de la mise à jour (elle reste celle de la création)
            if (dateLimiteEC != null) {
                existing.setDateLimite(dateLimiteEC.toString());
            }
            existing.setEspaceCours(espaceCours);
            existing.setElement(element);
            
            return elementCoursRepository.save(existing);
		}


		
		@Override
		public  ResponseEntity<?> ajouterElement(Long typeId, AjouterElementDTO request, MultipartFile file) {
		    if (file == null || file.isEmpty()) {
		        return ResponseEntity.badRequest().body("Fichier manquant.");
		    }

		    try {
		        // Création du répertoire d'upload
		        Path uploadPath = Paths.get(UPLOAD_DIR);
		        if (!Files.exists(uploadPath)) {
		            Files.createDirectories(uploadPath);
		        }

		        // Génération d'un nom unique pour le fichier
		        String originalFileName = file.getOriginalFilename();
		        originalFileName = originalFileName != null ? originalFileName.replaceAll("\\s+", "_") : "file";
		        String fileName = "elt_" + typeId + "_" + UUID.randomUUID() + "_" + originalFileName;
		        Path filePath = uploadPath.resolve(fileName);

		        // Sauvegarde du fichier
		        try (InputStream inputStream = file.getInputStream()) {
		            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
		        }

		        // Récupération du type d'élément
		        TypeElement typeElement = typeElementRepository.findById(request.getTypeId())
		            .orElseThrow(() -> new EntityNotFoundException("Type d'élément non trouvé avec l'ID: " + request.getTypeId()));

		        // Création et sauvegarde de l'élément
		        Element element = new Element();
		        element.setDesElt(request.getDescription());
		        element.setCheminElt("/uploads/" + fileName);
		        element.setTypeElement(typeElement);
		        element = elementRepository.save(element);

		        // Récupération de l'espace cours
		        EspaceCours espaceCours = espacecoursRepository.findById(request.getIdespac())
		            .orElseThrow(() -> new EntityNotFoundException("EspaceCours non trouvé avec l'ID: " + request.getIdespac()));

		        // Création et sauvegarde de l'ElementCours
		        ElementCours elementCours = new ElementCours();
		        elementCours.setOrdreEC(request.getOrdre());
		        elementCours.setVisibleEC(request.getVisible());
		        elementCours.setDateLimite(LocalDate.parse(request.getDateLimite()));
		        elementCours.setElement(element);
		        elementCours.setEspaceCours(espaceCours);
		        elementCoursRepository.save(elementCours);

		        return ResponseEntity.ok("Élément ajouté avec succès.");

		    } catch (IOException e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                             .body("Erreur lors du téléchargement du fichier : " + e.getMessage());
		    } catch (EntityNotFoundException e) {
		        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		    } catch (Exception e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                             .body("Erreur lors de l'ajout de l'élément : " + e.getMessage());
		    }
		}

		
		// Méthode pour récupérer tous les ElementCours
	    public List<ElementCours> getAllElementCourss() {
	        return elementCoursRepository.findAll();
	    }

	    // Méthode pour récupérer un ElementCours par son ID
	    public Optional<ElementCours> getElementCoursByIdd(Long id) {
	        return elementCoursRepository.findById(id);
	    }
		@Override
		public ElementCours addElementCours(ElementCours elementCours) {
			if (elementCours == null) {
                throw new ElementCoursException("L'objet ElementCours ne peut pas être null");
            }

            if (elementCours.getOrdreEC() < 0) {
                throw new ElementCoursException("L'ordre de l'élément de cours ne peut pas être négatif");
            }

            if (elementCours.getEspaceCours() == null) {
                throw new ElementCoursException("L'espace de cours est requis pour l'élément de cours");
            }

            if (elementCours.getElement() == null) {
                throw new ElementCoursException("L'élément est requis pour l'élément de cours");
            }
            
            // dateAjoutEC sera défini automatiquement via @PrePersist
            return elementCoursRepository.save(elementCours);
		}
		@Override
		public ElementCours updateElementCours(Long id, ElementCours elementCours) {
			ElementCours existing = getElementCoursById(id); // Lève une exception si non trouvé
            
            if (elementCours == null) {
                throw new ElementCoursException("L'objet ElementCours ne peut pas être null");
            }

            if (elementCours.getOrdreEC() < 0) {
                throw new ElementCoursException("L'ordre de l'élément de cours ne peut pas être négatif");
            }

            if (elementCours.getEspaceCours() == null) {
                throw new ElementCoursException("L'espace de cours est requis pour l'élément de cours");
            }

            if (elementCours.getElement() == null) {
                throw new ElementCoursException("L'élément est requis pour l'élément de cours");
            }

            // Mettre à jour les champs
            existing.setVisibleEC(elementCours.isVisibleEC());
            existing.setOrdreEC(elementCours.getOrdreEC());
            // Ne pas modifier dateAjoutEC lors de la mise à jour (elle reste celle de la création)
            existing.setDateLimite(elementCours.getDateLimite());
            existing.setEspaceCours(elementCours.getEspaceCours());
            existing.setElement(elementCours.getElement());

            return elementCoursRepository.save(existing);
		}
		@Override
		public void deleteElementCours(Long id) {
			// Check if the ElementCours exists (will throw ElementCoursException if not found)
			getElementCoursById(id);
            log.info("Deleting ElementCours with ID: {}", id);
            elementCoursRepository.deleteById(id);
            log.info("ElementCours with ID: {} deleted successfully", id);
		}
		
		
		
}

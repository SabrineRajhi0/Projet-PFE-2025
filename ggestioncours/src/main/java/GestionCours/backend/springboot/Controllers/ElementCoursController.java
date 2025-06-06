package GestionCours.backend.springboot.Controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import GestionCours.backend.springboot.Entity.Element;
import GestionCours.backend.springboot.Entity.ElementCours;
import GestionCours.backend.springboot.Entity.EspaceCours;
import GestionCours.backend.springboot.Entity.TypeElement;
import GestionCours.backend.springboot.Exception.ElementCoursException;
import GestionCours.backend.springboot.Repositrory.ElementCoursRepository;
import GestionCours.backend.springboot.Repositrory.ElementRepository;
import GestionCours.backend.springboot.Repositrory.EspaceCoursRepository;
import GestionCours.backend.springboot.Repositrory.TypeElementRepository;
import GestionCours.backend.springboot.Services.ElementCoursServiceInterface;
import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api/element-cours")
@CrossOrigin(origins = "http://localhost:3000")
public class ElementCoursController {

    private static final Logger logger = LoggerFactory.getLogger(ElementCoursController.class);
    
    @Value("${app.upload.elements-dir}")
    private String elementsDir;
    
    @Autowired
    private ElementCoursServiceInterface elementCoursService;
    
    @Autowired
    private EspaceCoursRepository EspaceCoursR;
    
    @Autowired
    private ElementCoursRepository ElementCoursR;
    
    @Autowired
    private TypeElementRepository TypeElementR;
    
    @Autowired
    private ElementRepository ElementR;

    @PostConstruct
    public void init() {
        try {
            // Create the directory using Path API for better handling
            Path uploadPath = Paths.get(elementsDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                logger.info("Created upload directory: {}", elementsDir);
            }
            
            // Verify write permissions
            if (!Files.isWritable(uploadPath)) {
                String errorMsg = "No write permission for upload directory: " + elementsDir;
                logger.error(errorMsg);
                throw new SecurityException(errorMsg);
            }
            
            logger.info("Upload directory initialized successfully at: {}", elementsDir);
        } catch (IOException e) {
            String errorMsg = "Failed to create upload directory: " + e.getMessage();
            logger.error(errorMsg, e);
            throw new RuntimeException(errorMsg, e);
        } catch (SecurityException e) {
            logger.error("Security error initializing upload directory: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @GetMapping("/getAllElementCours")
    public ResponseEntity<?> getAllElementCours() {
        try {
            logger.info("Fetching all element cours...");
            List<ElementCours> elementCoursList = elementCoursService.getAllElementCours();
            
            if (elementCoursList == null || elementCoursList.isEmpty()) {
                logger.info("No element cours found");
                return ResponseEntity.ok(List.of());
            }
            
            logger.info("Successfully retrieved {} element cours", elementCoursList.size());
            return ResponseEntity.ok(elementCoursList);
            
        } catch (ElementCoursException e) {
            logger.error("Business logic error while fetching element cours: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            logger.error("Unexpected error while fetching element cours: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred while fetching element cours"));
        }
    }

    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @GetMapping("/getElementCours/{id}")
    public ResponseEntity<?> getElementCoursById(@PathVariable Long id) {
        try {
            ElementCours elementCours = elementCoursService.getElementCoursById(id);
            logger.info("ElementCours récupéré avec succès pour l'ID : {}", id);
            return ResponseEntity.ok(elementCours);
        } catch (ElementCoursException e) {
            logger.error("Erreur lors de la récupération de l'ElementCours ID : {}", id, e);
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        } catch (NoSuchElementException e) {
            logger.error("ElementCours non trouvé avec l'ID : {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("ElementCours non trouvé avec l'ID : " + id);
        }
    }

    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @PostMapping(value = "/addElementCours", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> ajouterElementCours(
            @RequestParam("visibleEC") boolean visibleEC,
            @RequestParam("ordreEC") int ordreEC,
            @RequestParam("dateLimite") String dateLimite,
            @RequestParam("idespac") Long idEspaceCours,
            @RequestParam("idTE") Long idTE,
            @RequestParam("chemin_elt") MultipartFile fichier,
            @RequestParam("des_elt") String description
    ) {
        try {
            logger.info("Début de l'ajout d'un élément de cours");
            logger.debug("Paramètres reçus: visibleEC={}, ordreEC={}, dateLimite={}, idEspaceCours={}, idTE={}, description={}", 
                      visibleEC, ordreEC, dateLimite, idEspaceCours, idTE, description);

            // Validation du fichier
            if (fichier == null || fichier.isEmpty()) {
                logger.error("Fichier manquant ou vide");
                return ResponseEntity.badRequest().body("Fichier manquant ou vide");
            }

            // Validation des données
            if (idEspaceCours == null || idTE == null) {
                logger.error("ID espace cours ou ID type élément manquant");
                return ResponseEntity.badRequest().body("Données manquantes");
            }

            // Récupération de l'espace cours
            EspaceCours espaceCours = EspaceCoursR.findById(idEspaceCours)
                    .orElseThrow(() -> new NoSuchElementException("EspaceCours non trouvé avec l'ID: " + idEspaceCours));

            // Récupération du type d'élément
            TypeElement typeElement = TypeElementR.findById(idTE)
                    .orElseThrow(() -> new NoSuchElementException("TypeElement non trouvé avec l'ID: " + idTE));

            // Génération du nom de fichier unique
            String nomFichierOriginal = fichier.getOriginalFilename();
            if (nomFichierOriginal == null || nomFichierOriginal.trim().isEmpty()) {
                logger.error("Nom de fichier invalide");
                return ResponseEntity.badRequest().body("Nom de fichier invalide");
            }

            // Ensure the upload directory exists
            Path uploadPath = Paths.get(elementsDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                logger.info("Created upload directory: {}", uploadPath);
            }

            // Generate unique filename and create full path
            String nomFichierUnique = System.currentTimeMillis() + "_" + nomFichierOriginal.replaceAll("[^a-zA-Z0-9.-]", "_");
            Path destinationPath = uploadPath.resolve(nomFichierUnique);
            
            // Save the file using Files API
            try {
                Files.copy(fichier.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
                logger.info("Fichier sauvegardé avec succès: {}", destinationPath);
            } catch (IOException e) {
                logger.error("Erreur lors de la sauvegarde du fichier: {}", e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors de la sauvegarde du fichier: " + e.getMessage());
            }

            // Stockage du chemin relatif dans la base de données
            String cheminEnregistre = "uploads/elements/" + nomFichierUnique;
            
            // Création et sauvegarde de l'élément
            Element element = new Element();
            element.setDesElt(description);
            element.setCheminElt(cheminEnregistre);
            element.setTypeElement(typeElement);
            element.setEspaceCours(espaceCours);
            element = ElementR.save(element);

            // Création et sauvegarde de l'élément de cours
            ElementCours ec = new ElementCours();
            ec.setOrdreEC(ordreEC);
            ec.setVisibleEC(visibleEC);
            ec.setDateLimite(dateLimite);
            ec.setEspaceCours(espaceCours);
            ec.setElement(element);
            ElementCoursR.save(ec);

            logger.info("Élément de cours ajouté avec succès");
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Élément cours ajouté avec succès",
                "cheminFichier", cheminEnregistre,
                "idElt", element.getIdElt()
            ));

        } catch (NoSuchElementException e) {
            logger.error("Ressource non trouvée: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                        "status", "error",
                        "message", e.getMessage()
                    ));
        } catch (IOException e) {
            logger.error("Erreur d'entrée/sortie: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "status", "error",
                        "message", "Erreur lors de la manipulation du fichier: " + e.getMessage()
                    ));
        } catch (SecurityException e) {
            logger.error("Erreur de sécurité: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "status", "error",
                        "message", "Erreur d'accès: " + e.getMessage()
                    ));
        }
    }

    // Mise a jour  un élément de cours
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @PutMapping(value = "/updateElementCours/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateElementCours(
            @PathVariable Long id,
            @RequestParam(value = "visibleEC", required = false) Boolean visibleEC,
            @RequestParam(value = "ordreEC", required = false) Integer ordreEC,
            @RequestParam(value = "dateLimite", required = false) String dateLimite,
            @RequestParam(value = "idTE", required = false) Long idTE,
            @RequestParam(value = "chemin_elt", required = false) MultipartFile fichier,
            @RequestParam(value = "des_elt", required = false) String description) {
        
        try {
            // Récupérer l'ElementCours existant
            ElementCours ec = ElementCoursR.findById(id)
                    .orElseThrow(() -> new NoSuchElementException("ElementCours non trouvé avec l'ID: " + id));

            // Mettre à jour les champs si fournis
            if (visibleEC != null) {
                ec.setVisibleEC(visibleEC);
            }
            if (ordreEC != null) {
                ec.setOrdreEC(ordreEC);
            }
            if (dateLimite != null) {
                ec.setDateLimite(dateLimite);
            }

            // Récupérer l'Element associé
            Element element = ec.getElement();
            
            // Mettre à jour la description si fournie
            if (description != null) {
                element.setDesElt(description);
            }

            // Mettre à jour le TypeElement si fourni
            if (idTE != null) {
                TypeElement typeElement = TypeElementR.findById(idTE)
                        .orElseThrow(() -> new NoSuchElementException("TypeElement non trouvé avec l'ID: " + idTE));
                element.setTypeElement(typeElement);
            }

            // Gérer le fichier uploadé si fourni
            if (fichier != null && !fichier.isEmpty()) {
                // Crée le répertoire s'il n'existe pas
                Path uploadPath = Paths.get(elementsDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                    logger.info("Created upload directory: {}", elementsDir);
                }

                // Nom de fichier sécurisé et unique
                String nomFichierOriginal = fichier.getOriginalFilename();
                if (nomFichierOriginal == null || nomFichierOriginal.trim().isEmpty()) {
                    throw new IllegalArgumentException("Nom de fichier invalide");
                }
                String nomFichierUnique = System.currentTimeMillis() + "_" + nomFichierOriginal.replaceAll("[^a-zA-Z0-9.-]", "_");
                Path destinationPath = uploadPath.resolve(nomFichierUnique);
                
                // Save the file using Files API
                Files.copy(fichier.getInputStream(), destinationPath);
                logger.info("Fichier sauvegardé avec succès: {}", destinationPath);

                String cheminEnregistre = "uploads/elements/" + nomFichierUnique;
                element.setCheminElt(cheminEnregistre);
            }

            // Sauvegarder les modifications
            ElementR.save(element);
            ElementCoursR.save(ec);

            logger.info("Élément cours mis à jour avec succès, ID: {}", id);
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Élément cours mis à jour avec succès",
                "id", ec.getIdEC()
            ));
            
        } catch (NoSuchElementException e) {
            logger.error("Ressource non trouvée: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                        "status", "error",
                        "message", e.getMessage()
                    ));
        } catch (IllegalArgumentException e) {
            logger.error("Données invalides: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "status", "error",
                        "message", e.getMessage()
                    ));
        } catch (IOException e) {
            logger.error("Erreur d'entrée/sortie: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "status", "error",
                        "message", "Erreur lors de la manipulation du fichier: " + e.getMessage()
                    ));
        } catch (SecurityException e) {
            logger.error("Erreur de sécurité: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "status", "error",
                        "message", "Erreur d'accès: " + e.getMessage()
                    ));
        } catch (DataAccessException e) {
            logger.error("Erreur d'accès aux données: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "status", "error",
                        "message", "Erreur lors de la sauvegarde des données: " + e.getMessage()
                    ));
        } catch (Exception e) {
            logger.error("Erreur inattendue lors de la mise à jour: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "status", "error",
                        "message", "Une erreur inattendue s'est produite lors de la mise à jour"
                    ));
        }
    }

    // Supprimer un élément de cours
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @DeleteMapping("/deleteElementCours/{id}")
    public ResponseEntity<String> deleteElementCours(@PathVariable Long id) {
        try {
            elementCoursService.deleteElementCours(id);
            logger.info("ElementCours supprimé avec succès, ID : {}", id);
            return ResponseEntity.ok("Élément de cours supprimé avec succès !");
            
        } catch (ElementCoursException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @GetMapping("/v1/getByEspaceCoursId/{id}")
    public ResponseEntity<?> getElementsByEspaceCoursId(@PathVariable Long id) {
        try {
            logger.info("Fetching elements for espace cours ID: {}", id);
            
            // Verify if the espace cours exists
            if (!EspaceCoursR.existsById(id)) {
                logger.error("Espace cours not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                        "status", "error",
                        "message", "Espace cours non trouvé avec l'ID: " + id
                    ));
            }

            // Get all elements for this espace cours
            List<Element> elements = ElementR.findByEspaceCoursIdespac(id);
            
            if (elements == null || elements.isEmpty()) {
                logger.info("No elements found for espace cours ID: {}", id);
                return ResponseEntity.ok(List.of());
            }

            logger.info("Successfully retrieved {} elements for espace cours ID: {}", elements.size(), id);
            return ResponseEntity.ok(elements);

        } catch (Exception e) {
            logger.error("Error fetching elements for espace cours ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "status", "error",
                    "message", "Erreur lors de la récupération des éléments: " + e.getMessage()
                ));
        }
    }
}
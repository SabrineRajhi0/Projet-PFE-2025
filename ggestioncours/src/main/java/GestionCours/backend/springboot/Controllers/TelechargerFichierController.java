package GestionCours.backend.springboot.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import GestionCours.backend.springboot.Entity.Element;
import GestionCours.backend.springboot.Entity.TypeElement;
import GestionCours.backend.springboot.Repositrory.ElementRepository;
import GestionCours.backend.springboot.Repositrory.EspaceCoursRepository;
import GestionCours.backend.springboot.Repositrory.TypeElementRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/element")
public class TelechargerFichierController {

    private static final Logger log = LoggerFactory.getLogger(TelechargerFichierController.class);
    private static final String UPLOAD_DIR = Paths.get("uploads", "elements").toString();


    @Autowired
    private ElementRepository elementRepository;
    @Autowired
    private TypeElementRepository typeElementRepository;
    @Autowired
    private  EspaceCoursRepository   espaceCoursRepository;
    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        log.info("Upload directory initialized at: {}", UPLOAD_DIR);
        
        
        
        
        
        
        
    }
    
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{elementId}/upload")
    public ResponseEntity<String> uploadFile(@PathVariable Long elementId, @RequestParam("file") MultipartFile file) throws IOException {
        Optional<Element> elementOptional = elementRepository.findById(elementId);
        if (elementOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Element not found");
        }

        if (file.isEmpty()) {
            return ResponseEntity.status(400).body("File is empty");
        }

        // Sanitize the original filename
        String originalFileName = file.getOriginalFilename().replaceAll("\\s+", "_");
        String fileName = System.currentTimeMillis() + "_" + originalFileName;

        // Construct the full file path for saving to the file system
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        Path filePath = uploadPath.resolve(fileName).normalize();

        // Ensure the directory exists
        Files.createDirectories(uploadPath);

        // Save the file to the file system
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Construct the relative path for the database with proper separators
        String relativePath = "/uploads/elements/" + fileName; // Explicitly construct the path with forward slashes
        Element element = elementOptional.get();
        element.setCheminElt(relativePath); // e.g., /uploads/elements/1748438998308_result.pdf
        elementRepository.save(element);

        log.info("File uploaded successfully: {}", filePath.toAbsolutePath());
        return ResponseEntity.ok("File uploaded successfully: " + fileName);
    } 
    
    /*
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT')")
 
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam(value = "filename", required = false) String fileName) throws MalformedURLException {
        Path filePath = Paths.get(UPLOAD_DIR + fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.status(404).body(null);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }*/
    
    
  /*  @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT')")
    @GetMapping("/{docId}/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam(value = "filename", required = false) String fileName) {
        if (fileName == null || fileName.trim().isEmpty() || fileName.contains("..")) {
            log.warn("Invalid or missing filename: {}", fileName);
            return ResponseEntity.badRequest().build();
        }

        try {
            Path uploadDir = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            Path filePath = uploadDir.resolve(fileName).normalize();

            if (!filePath.startsWith(uploadDir)) {
                log.warn("Attempted access to unauthorized path: {}", filePath);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            if (!Files.isRegularFile(filePath) || !Files.isReadable(filePath)) {
                log.info("File not found or not readable: {}", filePath);
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            String contentType = Files.probeContentType(filePath);
            MediaType mediaType = contentType != null
                    ? MediaType.parseMediaType(contentType)
                    : MediaType.APPLICATION_OCTET_STREAM;

            String safeFileName = fileName.replaceAll("[^a-zA-Z0-9.-]", "_");

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeFileName + "\"")
                    .body(resource);

        } catch (Exception e) {
            log.error("Error serving file: {}", fileName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }*/
    
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT')")
    @GetMapping("/{docId}/download")
    public ResponseEntity<?> downloadFileByDocId(@PathVariable Long docId) {
        try {
            Optional<Element> optionalElement = elementRepository.findById(docId);
            if (optionalElement.isEmpty()) {
                log.warn("Document with ID {} not found in database", docId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Document introuvable en base de données"));
            }

            Element element = optionalElement.get();
            String cheminElt = element.getCheminElt(); // ex: "uploads/elements/fichier.pdf"

            if (cheminElt == null || cheminElt.contains("..")) {
                log.warn("Invalid path in cheminElt: {}", cheminElt);
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Chemin de fichier invalide"));
            }

            // Construct the system path
            Path filePath = Paths.get(cheminElt).normalize();
            log.info("Attempting to access file: {}", filePath.toAbsolutePath());

            // Check if file exists and is readable
            if (!Files.exists(filePath)) {
                log.warn("File does not exist at: {}", filePath.toAbsolutePath());
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Fichier non trouvé sur le serveur", "cheminCherché", filePath.toString()));
            }
            if (!Files.isReadable(filePath)) {
                log.warn("File is not readable at: {}", filePath.toAbsolutePath());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Fichier non lisible sur le serveur", "cheminCherché", filePath.toString()));
            }

            // Load the file as a resource
            Resource resource = new UrlResource(filePath.toUri());
            String contentType = Files.probeContentType(filePath);
            MediaType mediaType = contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_PDF;

            // Secure the file name
            String fileNameOnly = filePath.getFileName().toString();
            String safeFileName = fileNameOnly.replaceAll("[^a-zA-Z0-9._-]", "_");
            String encodedFileName = URLEncoder.encode(safeFileName, StandardCharsets.UTF_8.toString());

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
                    .body(resource);

        } catch (Exception e) {
            log.error("Error downloading document ID {}: {}", docId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur interne lors de la lecture du fichier"));
        }
    }
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT')")
    
    @GetMapping("/{docId}/download-info")
    public ResponseEntity<Map<String, Object>> getFileDownloadInfo(@PathVariable Long docId) {
        try {
            Optional<Element> optionalElement = elementRepository.findById(docId);
            if (optionalElement.isEmpty()) {
                log.warn("Document with ID {} not found in database", docId);
                return ResponseEntity.notFound().build();
            }

            Element element = optionalElement.get();
            String cheminElt = element.getCheminElt();
            if (cheminElt == null || cheminElt.contains("..")) {
                log.warn("Invalid path: {}", cheminElt);
                return ResponseEntity.badRequest().build();
            }

            Map<String, Object> response = Map.of(
                    "message", "File available",
                    "url", element.getCheminElt(),
                    "elementId", element.getIdElt()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting info for document ID {}: {}", docId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

  
    @PostMapping("upload")
    public ResponseEntity<?> addElementWithFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("desElt") String desElt,
            @RequestParam("typeElementId") Long typeElementId) {

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Le fichier est vide.");
            }

            Optional<TypeElement> optionalTypeElement = typeElementRepository.findById(typeElementId);
            if (optionalTypeElement.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("TypeElement non trouvé.");
            }

            // Define the upload directory
            Path uploadPath = Paths.get(UPLOAD_DIR).normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate the filename with a timestamp prefix
            String originalFileName = file.getOriginalFilename().replaceAll("\\s+", "_");
            String fileName = System.currentTimeMillis() + "_" + originalFileName;

            // Construct the full file path for saving the file
            Path filePath = uploadPath.resolve(fileName).normalize();
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Construct the relative path for the database without a leading slash
            String relativePath = Paths.get("uploads", "elements", fileName).toString().replace("\\", "/");

            // Create and save the element
            Element element = new Element();
            element.setDesElt(desElt);
            element.setCheminElt(relativePath); // e.g., uploads/elements/1748438998308_result.pdf
            element.setTypeElement(optionalTypeElement.get());

            elementRepository.save(element);

            log.info("File uploaded successfully to: {}", filePath.toAbsolutePath());
            return ResponseEntity.ok("Élément ajouté avec succès.");

        } catch (IOException e) {
            log.error("File upload error: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Erreur lors du téléchargement du fichier: " + e.getMessage());
        } catch (DataAccessException e) {
            log.error("Database error occurred: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Erreur de base de données: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Erreur inattendue: " + e.getMessage());
        }
    }
    
    
    /*
    

    @PostMapping("upload")
    public ResponseEntity<?> addElementWithFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("desElt") String desElt,
            @RequestParam("typeElementId") Long typeElementId) {

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Le fichier est vide.");
            }

            Optional<TypeElement> optionalTypeElement = typeElementRepository.findById(typeElementId);
            if (optionalTypeElement.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("TypeElement non trouvé.");
            }
            
            // Créer le répertoire de stockage s'il n'existe pas
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            String originalFileName = file.getOriginalFilename().replaceAll("\\s+", "_");
            String fileName = System.currentTimeMillis() + "_" + originalFileName;
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Element element = new Element();
            element.setDesElt(desElt);
            element.setCheminElt("/" + UPLOAD_DIR + fileName);
            element.setTypeElement(optionalTypeElement.get());

            elementRepository.save(element);

            return ResponseEntity.ok("Élément ajouté avec succès.");
            
            
            
        } catch (IOException e) {
            e.printStackTrace(); // Log l'erreur
            return ResponseEntity.internalServerError().body("Erreur lors du téléchargement du fichier: " + e.getMessage());
        } catch (DataAccessException e) {
            e.printStackTrace(); // Log les erreurs de base de données
            return ResponseEntity.internalServerError().body("Erreur de base de données: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // Log toutes autres erreurs
            return ResponseEntity.internalServerError().body("Erreur inattendue: " + e.getMessage());
        }

/*
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erreur lors du téléchargement du fichier.");
        }
            
            
    }
    */
        
    
    
    
    
    
    
        
        @DeleteMapping("/delete/{id}")
        public ResponseEntity<?> deleteElement(@PathVariable Long id) {
            Optional<Element> optionalElement = elementRepository.findById(id);

            if (optionalElement.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Élément non trouvé.");
            }

            Element element = optionalElement.get();
            String cheminFichier = element.getCheminElt();

            try {
                // Supprimer le fichier du système
                Path chemin = Paths.get(cheminFichier.replaceFirst("/", "")); // enlever le '/' initial si présent
                Files.deleteIfExists(chemin);

                // Supprimer l’élément en base de données
                elementRepository.deleteById(id);

                return ResponseEntity.ok("Élément supprimé avec succès.");
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                     .body("Erreur lors de la suppression du fichier.");
            }
        }

    }





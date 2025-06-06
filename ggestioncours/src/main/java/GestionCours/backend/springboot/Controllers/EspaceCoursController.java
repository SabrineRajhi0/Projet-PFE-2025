package GestionCours.backend.springboot.Controllers;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import GestionCours.backend.springboot.Entity.EspaceCours;
import GestionCours.backend.springboot.Exception.EspaceCoursException;
import GestionCours.backend.springboot.Services.EspaceCoursServiceInterface;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/api/espaceCours")
@CrossOrigin(origins = "http://localhost:3000")
public class EspaceCoursController {

    private static final Logger logger = LoggerFactory.getLogger(EspaceCoursController.class);

    @Autowired
    private EspaceCoursServiceInterface espaceCoursService;

    // Récupérer tous les espaces de cours
    @GetMapping("/getAllEspaceCours")
    public ResponseEntity<List<EspaceCours>> getAllEspaceCours() {
        List<EspaceCours> espaceCoursList = espaceCoursService.getAllespacecours();
        if (espaceCoursList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(espaceCoursList);
    }

    // Ajouter un nouvel espace de cours
	@PostMapping("/addEspaceCours")
 	public ResponseEntity<?> addEspaceCours(@RequestBody EspaceCours espaceCours) {
   
        try {
            EspaceCours savedEspaceCours = espaceCoursService.addEspace(espaceCours);
            return ResponseEntity.ok(savedEspaceCours);
        } catch (EspaceCoursException e) {
            return ResponseEntity.badRequest().body("Erreur de validation : " + e.getMessage());
        }
    }

    // Récupérer un espace de cours par ID
    @GetMapping("/getEspaceCours/{id}")
    public ResponseEntity<?> getEspaceCoursById(@PathVariable Long id) {
        try {
            EspaceCours espaceCours = espaceCoursService.getEspaceCoursById(id);
            return ResponseEntity.ok(espaceCours);
        } catch (EspaceCoursException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    // Mettre à jour un espace de cours
    @PutMapping("/updateEspaceCours/{id}")
    public ResponseEntity<?> updateEspaceCours(@PathVariable Long id,  @RequestBody EspaceCours espaceCours) {
        try {
            EspaceCours updatedEspaceCours = espaceCoursService. updateEspaceCours(id, espaceCours);
            return ResponseEntity.ok(updatedEspaceCours);
        } catch (EspaceCoursException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    // Supprimer un espace de cours
    @DeleteMapping("/deleteEspaceCours/{id}")
    public ResponseEntity<String> deleteEspaceCours(@PathVariable Long id) {
        try {
            espaceCoursService.deleteEspaceCours(id);
            return ResponseEntity.ok("Espace de cours supprimé avec succès !");
        } catch (EspaceCoursException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }
    
    //pour récupérer la liste de tous les espaces de cours avec leurs éléments associés
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/tablcour")
    public List<EspaceCours> listEspacesCours() {
        return espaceCoursService.getAllWithElements();
    }
    
    
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/uploads/elements/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("/projetgestioncours/uploads/elements").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Determine type and content type
            String fileType = determineFileType(filename);
            String contentType = getContentType(fileType, filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            shouldDisplayInline(fileType) 
                                ? "inline; filename=\"" + resource.getFilename() + "\"" 
                                : "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String determineFileType(String filename) {
        String lowerCaseFilename = filename.toLowerCase();
        
        if (lowerCaseFilename.endsWith(".jpg") || lowerCaseFilename.endsWith(".jpeg") || 
            lowerCaseFilename.endsWith(".png") || lowerCaseFilename.endsWith(".gif")) {
            return "IMAGE";
        } else if (lowerCaseFilename.endsWith(".pdf")) {
            return "PDF";
        } else if (lowerCaseFilename.endsWith(".mp4") || lowerCaseFilename.endsWith(".webm")) {
            return "VIDEO";
        } else if (lowerCaseFilename.endsWith(".docx")) {
            return "DOCUMENT_WORD";
        }
        return "UNKNOWN";
    }

    private String getContentType(String fileType, String filename) {
        switch (fileType) {
            case "IMAGE":
                if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                    return "image/jpeg";
                } else if (filename.toLowerCase().endsWith(".png")) {
                    return "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    return "image/gif";
                }
                break;
            case "PDF":
                return "application/pdf";
            case "VIDEO":
                if (filename.toLowerCase().endsWith(".mp4")) {
                    return "video/mp4";
                } else if (filename.toLowerCase().endsWith(".webm")) {
                    return "video/webm";
                }
                break;
            case "DOCUMENT_WORD":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }
        return "application/octet-stream";
    }

    private boolean shouldDisplayInline(String fileType) {
        return fileType.equals("IMAGE") || fileType.equals("PDF") || fileType.equals("VIDEO");
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteAllAndReset")
    public ResponseEntity<?> deleteAllAndResetSequence() {
        try {
            logger.info("Received request to delete all courses and reset sequence");
            espaceCoursService.deleteAllAndResetSequence();
            logger.info("Successfully deleted all courses and reset sequence");
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Tous les cours ont été supprimés et la séquence a été réinitialisée"
            ));
        } catch (Exception e) {
            logger.error("Error deleting all courses and resetting sequence: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "status", "error",
                    "message", "Erreur lors de la suppression des cours: " + e.getMessage()
                ));
        }
    }
}
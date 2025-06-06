package GestionCours.backend.springboot.Controllers;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import GestionCours.backend.springboot.Entity.Element;
import GestionCours.backend.springboot.Entity.ElementCours;
import GestionCours.backend.springboot.Entity.EspaceCours;
import GestionCours.backend.springboot.Entity.TypeElement;
import GestionCours.backend.springboot.Repositrory.EspaceCoursRepository;
import GestionCours.backend.springboot.Repositrory.TypeElementRepository;
import GestionCours.backend.springboot.Services.ElementServiceInterface;

@RestController
@RequestMapping("/api/element")
@CrossOrigin(origins = "http://localhost:3000")
public class ElementController {

    @Autowired
    private ElementServiceInterface elementService;
    
    @Autowired
    private TypeElementRepository typeElementRepository;
    
    @Autowired
    private  EspaceCoursRepository   espaceCoursRepository;
    

    
 // Ajouter un nouvel élément
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    
    @PostMapping("/addElement")
    public ResponseEntity<?> addElement(@RequestBody Element element, @RequestHeader HttpHeaders headers) {
        System.out.println("Received Content-Type: " + headers.getContentType());
        try {
            // Vérifier que les champs obligatoires sont présents
            if (element.getDesElt() == null || element.getDesElt().isEmpty()) {
                return ResponseEntity.badRequest().body("La description (desElt) est obligatoire.");
            }
            if (element.getCheminElt() == null || element.getCheminElt().isEmpty()) {
                return ResponseEntity.badRequest().body("Le chemin (cheminElt) est obligatoire.");
            }
            if (element.getTypeElement() == null || element.getTypeElement().getIdTE() == null) {
                return ResponseEntity.badRequest().body("Le type d'élément (typeElement) est obligatoire.");
            }
            if (element.getEspaceCours() == null || element.getEspaceCours().getIdespac() <= 0) {
                return ResponseEntity.badRequest().body("L'espace de cours (espaceCours) est obligatoire.");
            }

            // Vérifier l'existence des entités associées
            TypeElement typeElement = typeElementRepository.findById(element.getTypeElement().getIdTE())
                    .orElseThrow(() -> new IllegalArgumentException("TypeElement avec ID " + element.getTypeElement().getIdTE() + " non trouvé."));
            EspaceCours espaceCours = espaceCoursRepository.findById(element.getEspaceCours().getIdespac())
                    .orElseThrow(() -> new IllegalArgumentException("EspaceCours avec ID " + element.getEspaceCours().getIdespac() + " non trouvé."));

            // Assigner les entités vérifiées à l'élément
            element.setTypeElement(typeElement);
            element.setEspaceCours(espaceCours);

            // S'assurer que l'ID est null pour une insertion
            element.setIdElt(null);

            // Initialiser la liste des ElementCours si elle est null
            if (element.getElementsCours() == null) {
                element.setElementsCours(new ArrayList<>());
            }

            // Sauvegarder le nouvel élément via le service
            Element savedElement = elementService.addElement(element);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedElement);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'ajout de l'élément : " + e.getMessage());
        }
    }
    
    
    // Récupérer tous les éléments
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @GetMapping("/getAllElements")
    public ResponseEntity<List<Element>> getAllElements() {
        List<Element> elements = elementService.getAllElements();
        if (elements == null || elements.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.ok(elements); // 200 OK avec la liste
    }

    // Récupérer un élément par ID
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @GetMapping("/getElement/{id}")
    public ResponseEntity<?> getElementById(@PathVariable Long id) {
        try {
            Element element = elementService.getElementById(id);
            return ResponseEntity.ok(element);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : " + e.getMessage());
        }
    }
    
    
    

    
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @PutMapping(value = "/updateElement/{id}", consumes = "application/json")
    public ResponseEntity<?> updateElement(
            @PathVariable Long id,
            @RequestBody Element element,
            @RequestHeader HttpHeaders headers) {
        System.out.println("Received Content-Type: " + headers.getContentType());
        try {
            // Vérifier que l'élément existe
            Element existingElement = elementService.getElementById(id);
            if (existingElement == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Élément avec ID " + id + " non trouvé.");
            }

            // Valider les champs obligatoires
            if (element.getDesElt() == null || element.getDesElt().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La description (desElt) est obligatoire.");
            }
            if (element.getCheminElt() == null || element.getCheminElt().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le chemin (cheminElt) est obligatoire.");
            }
            if (element.getTypeElement() == null || element.getTypeElement().getIdTE() == null) {
                return ResponseEntity.badRequest().body("Le type d'élément (typeElement) est obligatoire.");
            }
            if (element.getEspaceCours() == null || element.getEspaceCours().getIdespac() <= 0) {
                return ResponseEntity.badRequest().body("L'espace de cours (espaceCours) est obligatoire.");
            }

            // Vérifier l'existence des entités associées
            TypeElement typeElement = typeElementRepository.findById(element.getTypeElement().getIdTE())
                    .orElseThrow(() -> new IllegalArgumentException("TypeElement avec ID " + element.getTypeElement().getIdTE() + " non trouvé."));
            EspaceCours espaceCours = espaceCoursRepository.findById(element.getEspaceCours().getIdespac())
                    .orElseThrow(() -> new IllegalArgumentException("EspaceCours avec ID " + element.getEspaceCours().getIdespac() + " non trouvé."));

            // Mettre à jour les champs de l'élément existant
            existingElement.setDesElt(element.getDesElt());
            existingElement.setCheminElt(element.getCheminElt());
            existingElement.setTypeElement(typeElement);
            existingElement.setEspaceCours(espaceCours);

            // Gérer la liste des ElementCours (si fournie)
            if (element.getElementsCours() != null) {
                existingElement.setElementsCours(new ArrayList<>());
                for (ElementCours ec : element.getElementsCours()) {
                    if (ec.getIdEC() == null) {
                        return ResponseEntity.badRequest().body("L'ID de ElementCours (idEC) est obligatoire.");
                    }
                    // Optionnel : Valider l'existence de ElementCours (nécessite ElementCoursRepository)
                    // ElementCours existingEC = elementCoursRepository.findById(ec.getIdEC())
                    //     .orElseThrow(() -> new IllegalArgumentException("ElementCours avec ID " + ec.getIdEC() + " non trouvé."));
                    existingElement.addElementCours(ec); // Assurez-vous que cette méthode existe
                }
            }

            // Sauvegarder l'élément mis à jour via le service
            Element updatedElement = elementService.updateElement(id, existingElement);
            return ResponseEntity.ok(updatedElement);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la mise à jour de l'élément : " + e.getMessage());
        }
    }   
    
    
    // Supprimer un élément
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @DeleteMapping("/deleteElement/{id}")
    public ResponseEntity<String> deleteElement(@PathVariable Long id) {
        try {
            elementService.deleteElement(id);
            return ResponseEntity.ok("Élément supprimé avec succès !");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : " + e.getMessage());
        }
    }
}
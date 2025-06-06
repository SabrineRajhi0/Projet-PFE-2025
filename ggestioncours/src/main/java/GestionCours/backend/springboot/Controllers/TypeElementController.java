package GestionCours.backend.springboot.Controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import GestionCours.backend.springboot.Entity.TypeElement;
import GestionCours.backend.springboot.Exception.TypeElementException;
import GestionCours.backend.springboot.Services.TypeElementServiceInterface;


@RestController
@RequestMapping("/api/type-element")
@CrossOrigin(origins = "http://localhost:3000")
public class TypeElementController {

    @Autowired
    private TypeElementServiceInterface typeElementService;

  //  Récupérer tous les types d'éléments
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @GetMapping("/getAllTypeElements")
    public ResponseEntity<List<TypeElement>> getAllTypeElements() {
        List<TypeElement> typeElements = typeElementService.getAllTypeElements();
        if (typeElements.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(typeElements);
    }

    // Ajouter un type d'élément
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @PostMapping("/addTypeElement")
    public ResponseEntity<?> addTypeElement( @RequestBody TypeElement typeElement) {
        try {
            TypeElement savedTypeElement = typeElementService.addTypeElement(typeElement);
            return ResponseEntity.ok(savedTypeElement);
        } catch (TypeElementException e) {
            return ResponseEntity.badRequest().body("Erreur de validation : " + e.getMessage());
        }
    }
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    // Récupérer un type d'élément par ID
    @GetMapping("/getTypeElement/{id}")
    public ResponseEntity<?> getTypeElementById(@PathVariable Long id) {
        try {
            TypeElement typeElement = typeElementService.getTypeElementById(id);
            return ResponseEntity.ok(typeElement);
        } catch (TypeElementException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    // Mettre à jour un type d'élément
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @PutMapping("/updateTypeElement/{id}")
    public ResponseEntity<?> updateTypeElement(@PathVariable Long id,  @RequestBody TypeElement typeElement) {
        try {
            TypeElement updatedTypeElement = typeElementService.updateTypeElement(id, typeElement);
            return ResponseEntity.ok(updatedTypeElement);
        } catch (TypeElementException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    // Supprimer un type d'élément
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @DeleteMapping("/deleteTypeElement/{id}")
    public ResponseEntity<String> deleteTypeElement(@PathVariable Long id) {
        try {
            typeElementService.deleteTypeElement(id);
            return ResponseEntity.ok("Type d'élément supprimé avec succès !");
        } catch (TypeElementException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }
}
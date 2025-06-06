package GestionCours.backend.springboot.Controllers;

import GestionCours.backend.springboot.Entity.Element;
import GestionCours.backend.springboot.Services.ElementServiceInterface1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/element/v1")
public class ElementController1 {

    @Autowired
    private ElementServiceInterface1 elementService;

    // 👇 Méthode demandée
    @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
    @GetMapping("/getByEspaceCoursId/{id}")
    public ResponseEntity<?> getFirstElementByEspaceCoursId(@PathVariable Long id) {

        Optional<Element> optionalElement = elementService.getFirstElementByEspaceCoursId(id);
        System.out.println(optionalElement);
        if (optionalElement.isPresent()) {
            return ResponseEntity.ok(optionalElement.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Aucun élément trouvé pour l'espace de cours ID : " + id);
        }
    }
}

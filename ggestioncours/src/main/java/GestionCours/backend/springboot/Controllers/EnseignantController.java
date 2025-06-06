package GestionCours.backend.springboot.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import GestionCours.backend.springboot.Entity.Enseignant;
import GestionCours.backend.springboot.Services.EnseignantService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/enseignants")
@RequiredArgsConstructor
public class EnseignantController {
    private  EnseignantService enseignantService;

    @GetMapping("/{id}")
    public ResponseEntity<Enseignant> getEnseignant(@PathVariable Long id) {
        return ResponseEntity.ok(enseignantService.getEnseignantById(id));
    }

    @GetMapping("/by-specialite/{specialite}")
    public ResponseEntity<List<Enseignant>> getBySpecialite(@PathVariable String specialite) {
        return ResponseEntity.ok(enseignantService.getEnseignantsBySpecialite(specialite));
    }
}

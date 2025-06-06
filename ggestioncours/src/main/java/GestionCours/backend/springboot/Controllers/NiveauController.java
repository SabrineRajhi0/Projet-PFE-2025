package GestionCours.backend.springboot.Controllers;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import GestionCours.backend.springboot.Entity.Niveau;
import GestionCours.backend.springboot.Services.NiveauServiceInterface;

import java.util.List;

@RestController
@RequestMapping("/api/niveau")
@CrossOrigin(origins = "http://localhost:3000")
public class NiveauController {

    @Autowired
    private NiveauServiceInterface niveauService;

    // Récupérer tous les niveaux
    @GetMapping("/getAllNiveau")
    public ResponseEntity<?> getAllNiveau() {
        try {
            List<Niveau> niveaux = niveauService.getAllNiveau();
            return new ResponseEntity<>(niveaux, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Erreur lors de la récupération des niveaux : " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Ajouter un niveau
    @PostMapping("/addNiveau")
    public ResponseEntity<?> addNiveau(@RequestBody Niveau niveau) {
        try {
            if (niveau.getNom() == null || niveau.getNom().trim().isEmpty()) {
                return new ResponseEntity<>("Le nom du niveau ne peut pas être vide", HttpStatus.BAD_REQUEST);
            }
            niveauService.addNiveau(niveau);
            return ResponseEntity.ok("Niveau ajouté avec succès !");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de l'ajout : " + e.getMessage());
        }
    }

    // Récupérer un niveau par ID
    @GetMapping("/getNiveau/{id}")
    public ResponseEntity<?> getNiveauById(@PathVariable("id") Long id) {
        try {
            Niveau niveau = niveauService.getNiveau(id);
            return new ResponseEntity<>(niveau, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Niveau non trouvé : " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Mettre à jour un niveau
    @PutMapping("/updateNiveau/{id}")
    public ResponseEntity<?> updateNiveau(@PathVariable("id") Long id, @RequestBody Niveau niveau) {
        try {
            niveauService.updateNiveau(id, niveau);
            return ResponseEntity.ok("Niveau modifié avec succès !");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de la mise à jour : " + e.getMessage());
        }
    }

    // Supprimer un niveau
    @DeleteMapping("/deleteNiveau/{id}")
    public ResponseEntity<?> deleteNiveau(@PathVariable("id") Long id) {
        try {
            niveauService.deleteNiveau(id);
            return ResponseEntity.ok("Niveau supprimé avec succès !");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de la suppression : " + e.getMessage());
        }
    }
}
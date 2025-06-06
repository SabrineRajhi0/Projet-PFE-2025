package GestionCours.backend.springboot.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import GestionCours.backend.springboot.Entity.Chapitre;
import GestionCours.backend.springboot.Exception.ChapitreException;
import GestionCours.backend.springboot.Services.ChapitreServiceInterface;

@RestController
@RequestMapping("/api/chapitre")
@CrossOrigin(origins = "http://localhost:3000")
public class ChapitreController {

    @Autowired
    private ChapitreServiceInterface chapitreService;

    // Récupérer tous les chapitres
    @GetMapping("/getAllChapitres")
    public ResponseEntity<?> getAllChapitres() {
        try {
            List<Chapitre> chapitres = chapitreService.getAllChapitres();
            return ResponseEntity.ok(chapitres); // Return 200 with empty list if no chapters
        } catch (ChapitreException e) {
            return ResponseEntity.status(404).body("Erreur : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne du serveur : " + e.getMessage());
        }
    }
    
    // Ajouter un chapitre
    @PostMapping("/addchapitre")
    public ResponseEntity<?> addChapitre(@RequestBody Chapitre chapitre) {
        try {
            Chapitre savedChapitre = chapitreService.addChapitre(chapitre);
            return ResponseEntity.ok(savedChapitre);
        } catch (ChapitreException e) {
            return ResponseEntity.status(400).body("Erreur de validation : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne du serveur : " + e.getMessage());
        }
    }

    // Récupérer un chapitre par ID
    @GetMapping("/getChapitre/{id}")
    public ResponseEntity<?> getChapitreById(@PathVariable Long id) {
        try {
            Chapitre chapitre = chapitreService.getChapitreById(id);
            if (chapitre == null) {
                return ResponseEntity.status(404).body("Chapitre non trouvé avec l'ID : " + id);
            }
            return ResponseEntity.ok(chapitre);
        } catch (ChapitreException e) {
            return ResponseEntity.status(404).body("Erreur : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne du serveur : " + e.getMessage());
        }
    }

    // Mettre à jour un chapitre
    @PutMapping("/updatechapitre/{id}")
    public ResponseEntity<?> updateChapitre(@PathVariable Long id, @RequestBody Chapitre chapitre) {
        try {
            Chapitre updatedChapitre = chapitreService.updateChapitre(id, chapitre);
            return ResponseEntity.ok(updatedChapitre);
        } catch (ChapitreException e) {
            return ResponseEntity.status(404).body("Erreur : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne du serveur : " + e.getMessage());
        }
    }

    // Supprimer un chapitre
    @DeleteMapping("/deleteChapitre/{id}")
    public ResponseEntity<?> deleteChapitre(@PathVariable Long id) {
        try {
            chapitreService.deleteChapitre(id);
            return ResponseEntity.ok("Chapitre supprimé avec succès !");
        } catch (ChapitreException e) {
            return ResponseEntity.status(404).body("Erreur : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne du serveur : " + e.getMessage());
        }
    }
}
package GestionCours.backend.springboot.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import GestionCours.backend.springboot.Entity.NiveauChapitreDTO;
import GestionCours.backend.springboot.Services.ChoisirService;

@RestController
@RequestMapping("/api/choisir")
@CrossOrigin(origins = "http://localhost:3000")
public class ChoisirController {

    @Autowired
    private ChoisirService choisirService;

    @GetMapping("/niveaux-chapitres")
    public ResponseEntity<?> getNiveauxAvecChapitres() {
        try {
            List<NiveauChapitreDTO> liste = choisirService.getNiveauxAvecChapitres();
            return new ResponseEntity<>(liste, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Erreur : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
 // Nouvel endpoint pour un niveau spécifique
    @GetMapping("/niveau/{id}")
    public NiveauChapitreDTO getNiveauAvecChapitresById(@PathVariable Long id) {
        return choisirService.getNiveauAvecChapitresById(id);
    }
    //Nouvel endpoint pour un niveau spécifique
    /*@GetMapping("/niveau/{nom}")
    public NiveauChapitreDTO getNiveauAvecChapitresById(@PathVariable String nom) {
        return choisirService.getNiveauAvecChapitresByNom(nom);
    }*/
}


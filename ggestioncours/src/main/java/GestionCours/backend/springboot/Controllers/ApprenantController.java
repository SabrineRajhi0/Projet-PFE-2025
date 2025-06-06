package GestionCours.backend.springboot.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import GestionCours.backend.springboot.Entity.Apprenant;
import GestionCours.backend.springboot.Services.ApprenantService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/apprenants")
@RequiredArgsConstructor
public class ApprenantController {

    @Autowired
    private  ApprenantService apprenantService ;

    @GetMapping("/{id}")
    public ResponseEntity<Apprenant> getApprenant(@PathVariable Long id) {
        return ResponseEntity.ok(apprenantService.getApprenantById(id));
    }

    @GetMapping("/by-niveau/{niveau}")
    public ResponseEntity<List<Apprenant>> getByNiveau(@PathVariable String niveau) {
        return ResponseEntity.ok(apprenantService.getApprenantsByNiveau(niveau));
    }
 // Passer le test et gérer l'inscription
    @PostMapping("/passer-test")
    public ResponseEntity<String> passerTestEtInscription(
            @RequestBody Apprenant apprenant,
            @RequestParam int scoreTest,
            @RequestParam boolean estInscrit) {
        String resultat = apprenantService.passerTestEtInscription(apprenant, scoreTest, estInscrit);
        return ResponseEntity.ok(resultat);
    }
}


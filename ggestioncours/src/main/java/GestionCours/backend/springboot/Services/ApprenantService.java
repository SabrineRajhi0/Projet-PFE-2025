package GestionCours.backend.springboot.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.Apprenant;
import GestionCours.backend.springboot.Repositrory.ApprenantRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApprenantService {
    private final ApprenantRepository apprenantRepository ;
    public Apprenant getApprenantById(Long id) {
        return apprenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apprenant non trouvé"));
    }

    public List<Apprenant> getApprenantsByNiveau(String niveau) {
        return apprenantRepository.findByNiveau(niveau);
    }
//cette commentairation pour facile le comprendre de code sans lire tous le code 
    /**
     * Méthode pour gérer le passage du test, l'inscription et l'attribution du type de cours.
     * @param apprenant L'apprenant qui passe le test
     * @param scoreTest Le score obtenu au test (sur 100)
     * @param estInscrit Indique si l'inscription est confirmée
     * @return Un message indiquant le résultat du processus
     */
    public String passerTestEtInscription(Apprenant apprenant, int scoreTest, boolean estInscrit) {
        // Vérifier si l'apprenant existe déjà dans la base via son email
        Apprenant apprenantExistant = apprenantRepository.findByEmail(apprenant.getEmail())
                .orElse(apprenant);

        // Mettre à jour le score du test
        // Note : Assurez-vous que l'entité Apprenant a un champ scoreTest (ex. private int scoreTest)
        apprenantExistant.setScoreTest(scoreTest);

        // Vérifier si l'inscription est confirmée
        if (!estInscrit) {
            return "Erreur : L'inscription doit être confirmée pour accéder au résultat du test.";
        }

        // Marquer l'apprenant comme inscrit
        // Note : Assurez-vous que l'entité Apprenant a un champ estInscrit (ex. private boolean estInscrit)
        apprenantExistant.setEstInscrit(true);

        // Sauvegarder l'apprenant dans la base
        apprenantRepository.save(apprenantExistant);

        // Vérifier le score pour attribuer le type de cours
        if (scoreTest >= 50) {
            // Attribuer un cours en ligne
            // Note : Assurez-vous que l'entité Apprenant a un champ typeCours (ex. private String typeCours)
            apprenantExistant.setTypeCours("EN_LIGNE");
            apprenantRepository.save(apprenantExistant);
            return "Félicitations ! Votre score est " + scoreTest + "/100. Vous êtes éligible pour un cours en ligne.";
        } else {
            // Attribuer un cours présentiel
            apprenantExistant.setTypeCours("PRESENTIEL");
            apprenantRepository.save(apprenantExistant);
            return "Votre score est " + scoreTest + "/100. Vous devez suivre un cours présentiel. " +
                   "Veuillez contacter notre assistant pour confirmer votre rendez-vous .";
        }
    }
}
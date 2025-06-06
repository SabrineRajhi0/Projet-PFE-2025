package GestionCours.backend.springboot.Services;


import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.Chapitre;
import GestionCours.backend.springboot.Entity.EspaceCours;
import GestionCours.backend.springboot.Entity.Niveau;
import GestionCours.backend.springboot.Exception.ChapitreException;
import GestionCours.backend.springboot.Repositrory.ChapitreRepository;
import GestionCours.backend.springboot.Repositrory.EspaceCoursRepository;
import GestionCours.backend.springboot.Repositrory.NiveauRepository;

import java.util.List;

@Service
public class ChapitreServiceimpL implements ChapitreServiceInterface {

    @Autowired
    private ChapitreRepository chapitreRepository;
    
    @Autowired
    private EspaceCoursRepository espaceCoursRepository;
    
    @Autowired
    private NiveauRepository niveauRepository;

    // Constructeur
    public ChapitreServiceimpL (ChapitreRepository chapitreRepository) {
        this.chapitreRepository = chapitreRepository;
    }

    // Récupérer tous les chapitres
    @Override
    public List<Chapitre> getAllChapitres() {
        return chapitreRepository.findAll();
    }
    
    
   // Ajouter un chapitre
    @Override
    public Chapitre addChapitre(Chapitre chapitre) {
        // Validation des champs obligatoires
        if (chapitre.getNomchap() == null || chapitre.getNomchap().trim().isEmpty()) {
            throw new ChapitreException("Le nom du chapitre est requis");
        }

        // Validation de la longueur maximale
        if (chapitre.getNomchap().length() > 255) {
            throw new ChapitreException("Le nom du chapitre ne doit pas dépasser 255 caractères");
        }

        // Vérification de l'existence du niveau
        Long idNiveau = chapitre.getNiveau().getId(); // ou getIdniveau() selon ta classe Niveau
        Niveau niveau = niveauRepository.findById(idNiveau)
            .orElseThrow(() -> new ChapitreException("Niveau introuvable"));
        
        // Vérification de l'existence de l'espace cours
        Long idEspc = chapitre.getEspaceCours().getIdespac(); // attention au nom du champ
        EspaceCours espaceCours = espaceCoursRepository.findById(idEspc)
            .orElseThrow(() -> new ChapitreException("Espace cours introuvable"));

        // Mise à jour des vraies entités dans le chapitre
        chapitre.setNiveau(niveau);
        chapitre.setEspaceCours(espaceCours);

        return chapitreRepository.save(chapitre);
    }


    /*
 // Ajouter un chapitre
    @Override
    public Chapitre addChapitre(Chapitre chapitre) {
        // Validation des champs obligatoires
        if (chapitre.getNomchap() == null || chapitre.getNomchap().trim().isEmpty()) {
            throw new ChapitreException("Le nom du chapitre est requis");
        }
        // Validation de la longueur maximale
        if (chapitre.getNomchap().length() > 255) {
            throw new ChapitreException("Le nom du chapitre ne doit pas dépasser 255 caractères");
        }

        return chapitreRepository.save(chapitre);
    }
*/

 // Récupérer un chapitre par ID
    @Override
    public Chapitre getChapitreById(Long id) {
        return chapitreRepository.findById(id)
                .orElseThrow(() -> new ChapitreException("Chapitre avec ID " + id + " non trouvé"));
    }

    
 // Mettre à jour un chapitre par ID
    @Override
    public Chapitre updateChapitre(Long id, Chapitre chapitre) {
        // Vérifier si le chapitre existe
        Chapitre existing = chapitreRepository.findById(id)
                .orElseThrow(() -> new ChapitreException("Chapitre avec ID " + id + " non trouvé"));

        // Validation des champs obligatoires
        if (chapitre.getNomchap() == null || chapitre.getNomchap().trim().isEmpty()) {
            throw new ChapitreException("Le nom du chapitre est requis");
        }
        // Validation de la longueur maximale
        if (chapitre.getNomchap().length() > 255) {
            throw new ChapitreException("Le nom du chapitre ne doit pas dépasser 255 caractères");
        }
        
        // Mettre à jour les champs
        existing.setNomchap(chapitre.getNomchap());

        // Sauvegarder les modifications
        return chapitreRepository.save(existing);
    }




    // Supprimer un chapitre par ID
    @Override
    public void deleteChapitre(Long id) {
        // Vérifier si le chapitre existe
        if (!chapitreRepository.existsById(id)) {
            throw new ChapitreException("Chapitre avec ID " + id + " non trouvé");
        }
        // Supprimer le chapitre
        chapitreRepository.deleteById(id);
    }
}

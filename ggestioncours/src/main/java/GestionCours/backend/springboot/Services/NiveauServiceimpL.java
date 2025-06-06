package GestionCours.backend.springboot.Services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.Niveau;
import GestionCours.backend.springboot.Exception.NiveauException;
import GestionCours.backend.springboot.Repositrory.NiveauRepository;

import java.util.List;

@Service
public class  NiveauServiceimpL  implements NiveauServiceInterface {

    @Autowired
    private NiveauRepository niveauRepository;

    // Constructeur
    public  NiveauServiceimpL (NiveauRepository niveauRepository) {
        this.niveauRepository = niveauRepository;
    }

    // Récupérer tous les niveaux
    @Override
    public List<Niveau> getAllNiveau() {
        return niveauRepository.findAll();
    }

    // Ajouter un niveau
    @Override
    public Niveau addNiveau(Niveau niveau) {
        // Validation des champs obligatoires
        if (niveau.getNom() == null || niveau.getNom().trim().isEmpty()) {
            throw new NiveauException("Le nom du niveau est requis");
        }
        // Validation de la longueur maximale
        if (niveau.getNom().length() > 255) {
            throw new NiveauException("Le nom du niveau ne doit pas dépasser 255 caractères");
        }
        return niveauRepository.save(niveau);
    }

    // Récupérer un niveau par ID
    @Override
    public Niveau getNiveau(Long id) {
        return niveauRepository.findById(id)
                .orElseThrow(() -> new NiveauException("Niveau avec ID " + id + " non trouvé"));
    }

    // Mettre à jour un niveau
    @Override
    public Niveau updateNiveau(Long id, Niveau niveau) {
        // Vérifier si le niveau existe
        Niveau existing = niveauRepository.findById(id)
                .orElseThrow(() -> new NiveauException("Niveau avec ID " + id + " non trouvé"));

        // Validation des champs obligatoires
        if (niveau.getNom() == null || niveau.getNom().trim().isEmpty()) {
            throw new NiveauException("Le nom du niveau est requis");
        }
        // Validation de la longueur maximale
        if (niveau.getNom().length() > 255) {
            throw new NiveauException("Le nom du niveau ne doit pas dépasser 255 caractères");
        }

        // Mettre à jour les champs
        existing.setNom(niveau.getNom());

        // Sauvegarder les modifications
        return niveauRepository.save(existing);
    }

    // Supprimer un niveau
    @Override
    public void deleteNiveau(Long id) {
        // Vérifier si le niveau existe
        if (!niveauRepository.existsById(id)) {
            throw new NiveauException("Niveau avec ID " + id + " non trouvé");
        }
        // Supprimer le niveau
        niveauRepository.deleteById(id);
    }
}
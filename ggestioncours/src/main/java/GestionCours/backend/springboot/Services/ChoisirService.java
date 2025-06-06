package GestionCours.backend.springboot.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.Chapitre;
import GestionCours.backend.springboot.Entity.Niveau;
import GestionCours.backend.springboot.Entity.NiveauChapitreDTO;
import GestionCours.backend.springboot.Repositrory.ChapitreRepository;
import GestionCours.backend.springboot.Repositrory.NiveauRepository;

@Service
public class ChoisirService {

    @Autowired
    private NiveauRepository niveauRepository;

    @Autowired
    private ChapitreRepository chapitreRepository;

    public List<NiveauChapitreDTO> getNiveauxAvecChapitres() {
        List<Niveau> niveaux = niveauRepository.findAll();
        List<NiveauChapitreDTO> result = new ArrayList<>();

        for (Niveau niveau : niveaux) {
            List<Chapitre> chapitres = chapitreRepository.findByNiveau(niveau);
            NiveauChapitreDTO dto = new NiveauChapitreDTO(niveau, chapitres);
            result.add(dto);
        }

        return result;
    }
 // Nouvelle méthode pour un niveau spécifique par ID
    public NiveauChapitreDTO getNiveauAvecChapitresById(Long niveauId) {
        Niveau niveau = niveauRepository.findById(niveauId)
            .orElseThrow(() -> new RuntimeException("Niveau non trouvé avec l'ID : " + niveauId));
        List<Chapitre> chapitres = chapitreRepository.findByNiveau(niveau);
        return new NiveauChapitreDTO(niveau, chapitres);
    }
    /*
    public NiveauChapitreDTO getNiveauAvecChapitresByNom(String nomNiveau) {
        Niveau niveau = niveauRepository.findByNom(nomNiveau)
            .orElseThrow(() -> new RuntimeException("Niveau non trouvé avec l'ID : " + nomNiveau));
        List<Chapitre> chapitres = chapitreRepository.findByNiveau(niveau);
        return new NiveauChapitreDTO(niveau, chapitres);
    }*/
}


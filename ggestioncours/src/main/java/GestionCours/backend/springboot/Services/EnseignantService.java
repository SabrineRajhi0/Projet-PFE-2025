package GestionCours.backend.springboot.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.Enseignant;
import GestionCours.backend.springboot.Repositrory.EnseignantRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnseignantService {
    private final EnseignantRepository enseignantRepository;
    

    public Enseignant getEnseignantById(Long id) {
        return enseignantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
    }

    public List<Enseignant> getEnseignantsBySpecialite(String specialite) {
        return enseignantRepository.findBySpecialite(specialite);
    }
}
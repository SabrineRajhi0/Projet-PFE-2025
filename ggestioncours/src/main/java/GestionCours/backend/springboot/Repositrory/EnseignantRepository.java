package GestionCours.backend.springboot.Repositrory;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.Enseignant;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    Optional<Enseignant> findByEmail(String email);
    
    @Query("SELECT e FROM Enseignant e WHERE e.specialite = :specialite")
    List<Enseignant> findBySpecialite(String specialite);
}
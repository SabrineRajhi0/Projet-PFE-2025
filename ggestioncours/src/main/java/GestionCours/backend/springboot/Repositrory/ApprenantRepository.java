package GestionCours.backend.springboot.Repositrory;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

import GestionCours.backend.springboot.Entity.Apprenant; // Assurez-vous que le chemin vers la classe Apprenant est correct
@Repository
public interface ApprenantRepository extends JpaRepository<Apprenant, Long> {
    Optional<Apprenant> findByEmail(String email);
    
    @Query("SELECT a FROM Apprenant a WHERE a.niveau = :niveau")
    List<Apprenant> findByNiveau(String niveau);
}

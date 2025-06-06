package GestionCours.backend.springboot.Repositrory;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.Chapitre;
import GestionCours.backend.springboot.Entity.Niveau;


@Repository
public interface ChapitreRepository extends JpaRepository<Chapitre, Long> {

	List<Chapitre> findByNiveau(Niveau niveau);
	

}

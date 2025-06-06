package GestionCours.backend.springboot.Repositrory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.ElementCours;




@Repository
public interface ElementCoursRepository  extends JpaRepository<ElementCours, Long>{
	@Query("SELECT DISTINCT ec FROM ElementCours ec " +
		   "LEFT JOIN FETCH ec.element e " +
		   "LEFT JOIN FETCH e.typeElement te " +
		   "LEFT JOIN FETCH ec.espaceCours esc " +
		   "WHERE ec IS NOT NULL")
	List<ElementCours> findAllWithDetails();
}

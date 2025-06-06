package GestionCours.backend.springboot.Repositrory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import GestionCours.backend.springboot.Entity.EspaceCours;

@Repository
public interface EspaceCoursRepository extends JpaRepository<EspaceCours, Long> {
	
	 @Query("SELECT DISTINCT ec FROM EspaceCours ec " +
	           "LEFT JOIN FETCH ec.elementsCours eCours " +  // matches EspaceCours.elementsCours
	           "LEFT JOIN FETCH eCours.element el " +        // matches ElementCours.element
	           "LEFT JOIN FETCH el.typeElement")             // matches Element.typeElement
	    List<EspaceCours> findAllWithElements();
	
	@Modifying
	@Transactional
	@Query(value = "DELETE FROM espace_cours", nativeQuery = true)
	void deleteAllCourses();
	
	@Modifying
	@Transactional
	@Query(value = "ALTER TABLE espace_cours AUTO_INCREMENT = 1", nativeQuery = true)
	void resetSequence();
	
	@Modifying
	@Transactional
	default void deleteAllAndResetSequence() {
		deleteAllCourses();
		resetSequence();
	}
}

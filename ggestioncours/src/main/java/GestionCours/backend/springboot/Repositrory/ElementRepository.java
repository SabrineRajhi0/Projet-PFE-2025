package GestionCours.backend.springboot.Repositrory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.Element;

@Repository
public interface ElementRepository extends JpaRepository<Element, Long> {

    /**
     * Find all elements associated with a specific espace cours
     * @param espaceCoursId the ID of the espace cours
     * @return list of elements associated with the espace cours
     */
    List<Element> findByEspaceCoursIdespac(Long espaceCoursId);
}

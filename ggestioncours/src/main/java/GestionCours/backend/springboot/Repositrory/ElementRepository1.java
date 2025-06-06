package GestionCours.backend.springboot.Repositrory;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import GestionCours.backend.springboot.Entity.Element;

public interface ElementRepository1 extends JpaRepository<Element, Long> {
Optional<Element> findTopByEspaceCoursIdespac(Long idEspaceCours);
}

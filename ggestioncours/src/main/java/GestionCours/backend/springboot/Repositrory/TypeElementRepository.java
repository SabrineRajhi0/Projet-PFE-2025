package GestionCours.backend.springboot.Repositrory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.TypeElement;




@Repository
public interface TypeElementRepository extends JpaRepository<TypeElement, Long> {

	TypeElement findByNomTE(String typeElement);

}

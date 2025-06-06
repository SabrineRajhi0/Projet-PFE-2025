package GestionCours.backend.springboot.Services;


import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import GestionCours.backend.springboot.DTO.AjouterElementDTO;
import GestionCours.backend.springboot.Entity.Element;
import GestionCours.backend.springboot.Entity.ElementCours;
import GestionCours.backend.springboot.Entity.EspaceCours;




public interface ElementCoursServiceInterface {
	

	List<ElementCours> getAllElementCours();

	ElementCours addElementCours(ElementCours elementCours);

	ElementCours getElementCoursById(Long id);

	ElementCours updateElementCours(Long id,  ElementCours elementCours);

	void deleteElementCours(Long id);

	

	ElementCours updateElementCours(Long id, boolean visibleEC, int ordreEC, LocalDate dateLimiteEC,
			EspaceCours espaceCours, Element element);
	
	

	  ResponseEntity<?> ajouterElement(Long typeId, AjouterElementDTO request, MultipartFile file);
	
	


}

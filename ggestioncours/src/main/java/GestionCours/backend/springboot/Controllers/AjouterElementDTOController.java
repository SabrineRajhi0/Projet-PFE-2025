package GestionCours.backend.springboot.Controllers;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import GestionCours.backend.springboot.DTO.AjouterElementDTO;
import GestionCours.backend.springboot.Entity.ElementCours;
import GestionCours.backend.springboot.Repositrory.ElementCoursRepository;
import GestionCours.backend.springboot.Services.ElementCoursServiceInterface;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/element-cours")
@CrossOrigin(origins = "http://localhost:3000")

public class AjouterElementDTOController {
	
	   @Autowired
	    private ElementCoursRepository elementCoursRepository;
	
	   @Autowired
	    private ElementCoursServiceInterface elementCoursService;
	   

	  
	   
	   

	    // ✅ Ajouter un élément avec fichier (utilisé pour les uploads)
	   @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
	   @PostMapping(value = "/ajouterelement", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	    public ResponseEntity<?> ajouterElementCours(
	        @RequestParam("typeId") Long typeId,
	        @RequestPart("request") @Validated AjouterElementDTO request,
	        @RequestPart("file") MultipartFile file
	    ) {
	        try {
	            // Appel du service pour ajouter l'élément
	            ResponseEntity<?> createdElement = elementCoursService.ajouterElement(typeId, request, file);
	            return ResponseEntity.ok(createdElement);
	        } catch (EntityNotFoundException e) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'ajout de l'élément.");
	        }
	    }
	



	   @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
	    @GetMapping("/api/getelementCours")
	    public ResponseEntity<List<ElementCours>> getAllElementCours() {
	        List<ElementCours> elementCoursList = elementCoursRepository.findAll();
	        return ResponseEntity.ok(elementCoursList);
	    }

	   @PreAuthorize("hasAnyRole('APPRENANT', 'ENSEIGNANT', 'ADMIN')")
	    @GetMapping("/api/getelementCoursbyID/{id}")
	    public ResponseEntity<ElementCours> getElementCoursById(@PathVariable Long id) {
	        return elementCoursRepository.findById(id)
	            .map(ResponseEntity::ok)
	            .orElse(ResponseEntity.notFound().build());
	    }


	}
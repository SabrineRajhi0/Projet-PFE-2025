package GestionCours.backend.springboot.Services;


import java.util.List;

import GestionCours.backend.springboot.Entity.Chapitre;


public interface ChapitreServiceInterface {

	List<Chapitre> getAllChapitres();

	Chapitre addChapitre(Chapitre chapitre);

	Chapitre getChapitreById(Long id);

	Chapitre updateChapitre(Long id, Chapitre chapitre);

	void deleteChapitre(Long id);

	

}

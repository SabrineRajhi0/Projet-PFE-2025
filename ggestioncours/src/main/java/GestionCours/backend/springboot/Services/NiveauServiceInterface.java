package GestionCours.backend.springboot.Services;


import java.util.List;

import GestionCours.backend.springboot.Entity.Niveau;


public interface NiveauServiceInterface {

	List<Niveau> getAllNiveau();

	Niveau addNiveau(Niveau niveau);

	Niveau getNiveau(Long id);

	Niveau updateNiveau(Long id, Niveau niveau);

	void deleteNiveau(Long id);

}

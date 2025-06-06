package GestionCours.backend.springboot.Entity;

import java.util.List;

public class NiveauChapitreDTO {
    private Niveau niveau;
    private List<Chapitre> chapitres;

    public NiveauChapitreDTO(Niveau niveau, List<Chapitre> chapitres) {
        this.niveau = niveau;
        this.chapitres = chapitres;
    }

	public Niveau getNiveau() {
		return niveau;
	}

	public void setNiveau(Niveau niveau) {
		this.niveau = niveau;
	}

	public List<Chapitre> getChapitres() {
		return chapitres;
	}

	public void setChapitres(List<Chapitre> chapitres) {
		this.chapitres = chapitres;
	}

  
}


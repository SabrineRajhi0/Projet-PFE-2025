package GestionCours.backend.springboot.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.NoArgsConstructor;


@NoArgsConstructor

@Entity
public class Niveau {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    
    @OneToMany(mappedBy = "niveau") // "niveau" correspond à l'attribut dans Chapitre
    @JsonManagedReference
    private List<Chapitre> chapitres;



	


	public Niveau(Long id, String nom, List<Chapitre> chapitres) {
		
		this.id = id;
		this.nom = nom;
		this.chapitres = chapitres;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}



	public String getNom() {
		return nom;
	}


	public void setNom(String nom) {
		this.nom = nom;
	}



	public List<Chapitre> getChapitres() {
		return chapitres;
	}


	public void setChapitres(List<Chapitre> chapitres) {
		this.chapitres = chapitres;
	}


}
package GestionCours.backend.springboot.Entity;



import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "chapitre")
public class Chapitre {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idchap;
    private String nomchap;
    
    @ManyToOne
    @JoinColumn(name = "id_niveau")
    @JsonBackReference // Breaks the back reference (niveau)
    private Niveau niveau;
    

    @ManyToOne
    @JoinColumn(name = "id_espc")
    
    private EspaceCours espaceCours;
    
    // Constructeurs
    public Chapitre() {}

	public Chapitre(long idchap, String nomchap, Niveau niveau, EspaceCours espaceCours) {
		super();
		this.idchap = idchap;
		this.nomchap = nomchap;
		this.niveau = niveau;
		this.espaceCours = espaceCours;
	}
	
	// getters et setters 

	public long getIdchap() {
		return idchap;
	}

	public void setIdchap(long idchap) {
		this.idchap = idchap;
	}

	public String getNomchap() {
		return nomchap;
	}

	public void setNomchap(String nomchap) {
		this.nomchap = nomchap;
	}

	public Niveau getNiveau() {
		return niveau;
	}

	public void setNiveau(Niveau niveau) {
		this.niveau = niveau;
	}

	public EspaceCours getEspaceCours() {
		return espaceCours;
	}

	public void setEspaceCours(EspaceCours espaceCours) {
		this.espaceCours = espaceCours;
	}
    
    
    
    
}
package GestionCours.backend.springboot.Entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@Entity
public class Enseignant extends User {


    private String specialite;
    @OneToMany(mappedBy = "enseignant") // un enseignant a affecté a plusieurs espaces de  cours
    private List<EspaceCours> cours;






	// Constructeur
    public Enseignant(Long id, String nom, String prenom, String email,String pwd,Role role,String cle,  String specialite) {
        super( nom, prenom, email,pwd,role,cle);

        this.specialite=specialite;


    }






	public String getSpecialite() {
		return specialite;
	}









	public void setSpecialite(String specialite) {
		this.specialite = specialite;
	}









	public List<EspaceCours> getCours() {
		return cours;
	}









	public void setCours(List<EspaceCours> cours) {
		this.cours = cours;
	}



    public Enseignant() {};






	// Méthodes
    public void creerCours() {
        // Logique pour créer un cours
    }

    public void remplirEspacCours() {
        // Logique pour remplir les espaces de cours
    }
    //super(id, nom, prenom, email, role);
}

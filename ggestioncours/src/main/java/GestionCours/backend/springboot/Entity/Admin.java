package GestionCours.backend.springboot.Entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data

@Entity
public class Admin extends User {


	@OneToMany(mappedBy = "administrateurs")
	private List<EspaceCours> espaceCours;


	    public Admin( String nom, String prenom, String email,String pwd,Role role,String cle, List<EspaceCours> espaceCours) {
	        super( nom, prenom, email,pwd,role,cle);
	        this.espaceCours = espaceCours;
	    }

		public List<EspaceCours> getEspaceCours() {
			return espaceCours;
		}

		public void setEspaceCours(List<EspaceCours> espaceCours) {
			this.espaceCours = espaceCours;
		}

		public Admin() {};



}


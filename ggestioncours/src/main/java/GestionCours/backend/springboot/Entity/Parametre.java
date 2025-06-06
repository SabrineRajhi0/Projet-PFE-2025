package GestionCours.backend.springboot.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Parametre {


	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


	private long idparam;
	// Constantes statiques pour les clés
    public static final String cleApprenant = "apprenant";
    public static final String cleEnseignant = "enseignant";
    public static final String cleAdmin = "admin";
	public Parametre() {}


	




	public long getIdparam() {
		return idparam;
	}
	public void setIdparam(long idparam) {
		this.idparam = idparam;
	}


}

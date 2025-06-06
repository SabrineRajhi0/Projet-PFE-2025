package GestionCours.backend.springboot.Entity;

public enum Role {
	APPRENANT,
	ENSEIGNANT,
	ADMIN;
	   
	    public String getAuthority() {
	        return name(); // Retourne "ROLE_ADMIN", "ROLE_USER", etc.
	    }
	}



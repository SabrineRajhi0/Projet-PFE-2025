package GestionCours.backend.springboot.Entity;

public enum UserStatus {
	
	
	
	 PENDING,   // En attente de validation (ex: inscription)

	    ACTIVE,    // Utilisateur actif

	    BLOCKED,   // Bloqué par un admin

	    REJECTED,  // Rejeté (ex: inscription refusée)

	    DELETED    // Suppression logique (soft delete)

}
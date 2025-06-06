package GestionCours.backend.springboot.Exception;

public class UserNotFoundException extends RuntimeException {
	// Constructeur avec un message d'erreur

	  // Constructeur par défaut
	  public  UserNotFoundException() {
	      super("Account not found");
	  }

	  // Constructeur avec un message personnalisé
	  public  UserNotFoundException(String message) {
	      super(message);
	  }

	  // Constructeur avec un message et une cause
	  public  UserNotFoundException(String message, Throwable cause) {
	      super(message, cause);
	  }

	  // Constructeur avec une cause
	  public  UserNotFoundException(Throwable cause) {
	      super(cause);
	  }
}
package GestionCours.backend.springboot.Exception;





//Exception personnalisée pour gérer les comptes introuvables
public class  accountNotFoundException extends RuntimeException {
// Constructeur avec un message d'erreur

  // Constructeur par défaut
  public  accountNotFoundException() {
      super("Account not found");
  }

  // Constructeur avec un message personnalisé
  public  accountNotFoundException(String message) {
      super(message);
  }

  // Constructeur avec un message et une cause
  public  accountNotFoundException(String message, Throwable cause) {
      super(message, cause);
  }

  // Constructeur avec une cause
  public  accountNotFoundException(Throwable cause) {
      super(cause);
  }
}


package GestionCours.backend.springboot.Exception;


public class NiveauException extends RuntimeException {
    
    // Correction de l'espace après le nom du constructeur
    public NiveauException(String message) {
        super(message);
    }

    public NiveauException(String message, Throwable cause) {
        super(message, cause);
    }
}
package GestionCours.backend.springboot.Exception;


public class TypeElementException extends RuntimeException {

    public TypeElementException(String message) {
        super(message);
    }

    public TypeElementException(String message, Throwable cause) {
        super(message, cause);
    }
}
package GestionCours.backend.springboot.Exception;


public class ElementCoursException extends RuntimeException {

    public ElementCoursException(String message) {
        super(message);
    }

    public ElementCoursException(String message, Throwable cause) {
        super(message, cause);
    }
}
package GestionCours.backend.springboot.Exception;


// Custom exception class for handling chapter-related errors
public class ChapitreException extends RuntimeException {

    // Constructor with a message
    public ChapitreException(String message) {
        super(message);
    }

    // Constructor with a message and a cause
    public ChapitreException(String message, Throwable cause) {
        super(message, cause);
    }
}
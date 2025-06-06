package GestionCours.backend.springboot.Exception;


// Custom exception class for handling course-related errors
public class EspaceCoursException extends RuntimeException {

    // Constructor with a message
    public EspaceCoursException(String message) {
        super(message);
    }

    // Constructor with a message and a cause
    public EspaceCoursException(String message, Throwable cause) {
        super(message, cause);
    }
}

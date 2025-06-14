package GestionCours.backend.springboot.Controllers;

// Java standard library imports
import java.util.List;  // Used in getAllUsers() return type and method
import java.util.Map;   // Used in blockUser() and rejeteeUser() parameters

import org.springframework.beans.factory.annotation.Autowired;  // Used for @Autowired annotation
import org.springframework.http.HttpStatus;  // Used in ResponseEntity.status() calls
import org.springframework.http.ResponseEntity;  // Used in all endpoint return types
import org.springframework.security.access.prepost.PreAuthorize;  // Used for @PreAuthorize annotations
import org.springframework.web.bind.annotation.DeleteMapping;  // Used for @DeleteMapping annotation
import org.springframework.web.bind.annotation.GetMapping;  // Used for @GetMapping annotations
import org.springframework.web.bind.annotation.PathVariable;  // Used for @PathVariable annotations
import org.springframework.web.bind.annotation.PutMapping;  // Used for @PutMapping annotations
import org.springframework.web.bind.annotation.RequestBody;  // Used for @RequestBody annotations
import org.springframework.web.bind.annotation.RequestMapping;  // Used for @RequestMapping annotation
import org.springframework.web.bind.annotation.RestController;  // Used for @RestController annotation

import GestionCours.backend.springboot.Entity.User;  // Used in method parameters and return types
import GestionCours.backend.springboot.Exception.accountNotFoundException;  // Used for userService field
import GestionCours.backend.springboot.Services.UserService;  // Used in getUserById() catch block

@RestController
@RequestMapping("/users")
public class Usercontrollers {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
@PutMapping("/{id}")
public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
    try {
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    } catch (accountNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}

    // Récupérer tous les utilisateurs (réservé aux admins)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        // Add debug information
        if (users != null && !users.isEmpty()) {
            for (User user : users) {
                if (user.getCreatedAt() == null) {
                    System.out.println("WARNING: User " + user.getId() + " has null createdAt");
                } else {
                    System.out.println("INFO: User " + user.getId() + " createdAt: " + user.getCreatedAt());
                }
            }
        }
        return ResponseEntity.ok(users);
    }

    // Find user by email
    @GetMapping("/findByEmail/{email}")
    public ResponseEntity<User> findByEmail(@PathVariable String email) {
        User user = userService.findByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }



    @GetMapping("/findById/{userId}")
    public ResponseEntity<User> findById(@PathVariable long userId) {
        User user = userService.findById(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Récupérer un utilisateur par ID (réservé aux admins ou à l'utilisateur concerné)
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (accountNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/activate/{userId}")
    public ResponseEntity<String> activateUser(@PathVariable Long userId) {
        String response = userService.activateUser(userId);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/block/{userId}")
    public ResponseEntity<String> blockUser(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            // Extract reason for blocking from request body
            String reason = request.get("reason");

            // Call the service method to block the user
            userService.blockUser(userId, reason);

            // Return a success response
            return ResponseEntity.ok("User blocked successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error blocking the user: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/rejetee/{userId}")
    public ResponseEntity<String> rejeteeUser(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        String response = userService.rejectUser(userId, reason);
        if (response.equals("User not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    // Unblock user method
    @PutMapping("/unblock/{userId}")
    public ResponseEntity<String> unblockUser(@PathVariable Long userId) {
        try {
            // Call the service method to unblock the user
            userService.unblockUser(userId);

            // Return a success response
            return ResponseEntity.ok("User unblocked successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error unblocking the user: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // Debug endpoint to check createdAt values
    @GetMapping("/debug/{userId}")
    public ResponseEntity<Map<String, Object>> debugUser(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("hasCreatedAt", user.getCreatedAt() != null);
            response.put("createdAt", user.getCreatedAt());
            response.put("createdAtFormatted", user.getCreatedAt() != null ? 
                         user.getCreatedAt().toString() : "null");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body(Map.of("error", ex.getMessage()));
        }
    }





}
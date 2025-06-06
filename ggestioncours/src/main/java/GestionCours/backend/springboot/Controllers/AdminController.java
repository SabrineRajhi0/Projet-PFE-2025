package GestionCours.backend.springboot.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import GestionCours.backend.springboot.Entity.User;
import GestionCours.backend.springboot.Services.AdminService;

@RestController
@RequestMapping("/admin")

@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Récupérer tous les utilisateurs
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return adminService.getAllUserss(); // Correction du nom de méthode
    }

    // Ajouter un utilisateur
    @PostMapping("/add")
    public User createUser(@RequestBody User user) {
        return adminService.addUserr(user); // Correction du nom de méthode
    }

    // Mettre à jour un utilisateur
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return adminService.updateUser(id, user); // Correction du nom de méthode
    }

    // Supprimer un utilisateur
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
    	adminService.deleteUser(id); // Correction du nom de méthode
        return ResponseEntity.ok("Utilisateur supprimé avec succès !");
    }

    // Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }


}

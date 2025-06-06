package GestionCours.backend.springboot.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.Admin;
import GestionCours.backend.springboot.Entity.User;
import GestionCours.backend.springboot.Repositrory.AdminRepositroy;
@Service
public class AdminServiceImpl  implements AdminService{
	private final AdminRepositroy adminRepository;

	   @Autowired
	    public  AdminServiceImpl(AdminRepositroy adminRepository) {
	        this.adminRepository = adminRepository;
	    }



	   @Override

	   public List<User> getAllUserss()
	    {
	        return adminRepository.findAll();
	    }


	    // Récupérer un utilisateur par ID
	   @Override
	    public User getUserById(Long id) {
	        return adminRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Utilisateur avec ID " + id + " non trouvé."));
	    }


	   @Override
	    public User addUserr(User user) {
	        return adminRepository.save(user);
	    }



	    // Mettre à jour un utilisateur
	   @Override
	    public User updateUser(Long id, User userDetails) {
	        Optional<User> optionalUser = adminRepository.findById(id);

	        if (optionalUser.isPresent()) {
	            User user = optionalUser.get();
	            user.setNom(userDetails.getNom());
	            user.setPrenom(userDetails.getPrenom());
	            user.setEmail(userDetails.getEmail());
	            user.setPassword(userDetails.getPassword());
	            user.setRole(userDetails.getRole());
	            return adminRepository.save(user);
	        } else {
	            throw new RuntimeException("Utilisateur avec ID " + id + " non trouvé.");
	        }
	    }

	    // Supprimer un utilisateur
	   @Override
	    public void deleteUser(Long id) {
	        if (!adminRepository.existsById(id)) {
	            throw new RuntimeException("Utilisateur avec ID " + id + " non trouvé.");
	        }
	        adminRepository.deleteById(id);
	    }




}

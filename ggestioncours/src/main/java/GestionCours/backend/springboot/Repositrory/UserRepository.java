package GestionCours.backend.springboot.Repositrory;




import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.Admin;
import GestionCours.backend.springboot.Entity.Apprenant;
import GestionCours.backend.springboot.Entity.Enseignant;
import GestionCours.backend.springboot.Entity.User;
@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	Optional<Apprenant> findApprenantByEmail(String email);
    Optional<Enseignant> findEnseignantByEmail(String email);
    Optional<Admin> findAdminByEmail(String email);

     
    User findById(long userId);

    User findByEmail(String email);
	Optional<User> findByResetToken(String token);

   // Optional<User> findByEmail(String email);

    //Optional<User> findByEmail(String email);
}

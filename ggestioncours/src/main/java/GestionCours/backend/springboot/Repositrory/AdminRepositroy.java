package GestionCours.backend.springboot.Repositrory;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.Admin;
import GestionCours.backend.springboot.Entity.Apprenant;
import GestionCours.backend.springboot.Entity.User;
@Repository
public interface AdminRepositroy extends JpaRepository<User, Long>{


   // Optional<User> findByEmail(String email);




}

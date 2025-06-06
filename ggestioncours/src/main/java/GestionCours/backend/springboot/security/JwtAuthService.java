package GestionCours.backend.springboot.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.Apprenant;
import GestionCours.backend.springboot.Entity.Enseignant;
import GestionCours.backend.springboot.Entity.Admin;
import GestionCours.backend.springboot.Repositrory.UserRepository;


import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class JwtAuthService  {

	 private final JwtUtils jwtUtil;
    private final UserRepository userRepository;

    @Autowired
    public JwtAuthService(UserRepository userRepository, JwtUtils jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil= jwtUtil;
    }

    public String generateAuthToken(String email) {
        UserDetails userDetails = loadUserByUsername(email);
        return jwtUtil.generateToken(
            userDetails.getUsername(),
            userDetails.getAuthorities()
        );
    }

    

    
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Apprenant> apprenant = userRepository.findApprenantByEmail(email);
        Optional<Enseignant> enseignant = userRepository.findEnseignantByEmail(email);
        Optional<Admin> admin = userRepository.findAdminByEmail(email);

        if (apprenant.isPresent()) {
            return buildUserDetails(apprenant.get());
        } else if (enseignant.isPresent()) {
            return buildUserDetails(enseignant.get());
        } else if (admin.isPresent()) {
            return buildUserDetails(admin.get());
        }

        throw new UsernameNotFoundException("Aucun utilisateur trouvé avec l'email : " + email);
    }

    private UserDetails buildUserDetails(Object userEntity) {
        String email;
        String password;
        String role;

        if (userEntity instanceof Apprenant) {
            Apprenant apprenant = (Apprenant) userEntity;
            email = apprenant.getEmail();
            password = apprenant.getPassword();
            role = "ROLE_APPRENANT";
        } else if (userEntity instanceof Enseignant) {
            Enseignant enseignant = (Enseignant) userEntity;
            email = enseignant.getEmail();
            password = enseignant.getPassword();
            role = "ROLE_ENSEIGNANT";
        } else if (userEntity instanceof Admin) {
            Admin admin = (Admin) userEntity;
            email = admin.getEmail();
            password = admin.getPassword();
            role = "ROLE_ADMIN";
        } else {
            throw new IllegalArgumentException("Type d'utilisateur non supporté");
        }

        if (email == null || password == null) {
            throw new IllegalStateException("Email ou mot de passe manquant pour l'utilisateur");
        }

        List<GrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority(role)
        );

        return new User(email, password, authorities);
    }
}
package GestionCours.backend.springboot.Services;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.Role;
import GestionCours.backend.springboot.Entity.User;
import GestionCours.backend.springboot.Repositrory.UserRepository;

@Service

public class MyUsrDetailsService implements UserDetailsService {

	//private static final Logger log = (Logger) LoggerFactory.getLogger(MyUsrDetailsService.class);
    private final UserRepository userRepository;
    @Autowired
    public  MyUsrDetailsService ( UserRepository userRepository) {
    	this.userRepository=userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Récupérer l'utilisateur par email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email);
        }



        // Vérifier et récupérer le rôle
        Role userRole = user.getRole();
        if (userRole == null) {
            throw new UsernameNotFoundException("L'utilisateur n'a pas de rôle valide.");
        }

        // Création de l'autorité à partir du rôle
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + userRole.name());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(authority)
        );
    }
    /*@Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Tentative de chargement de l'utilisateur avec l'email : {}", email);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email));
        log.info("Utilisateur trouvé : {}, rôle : {}", user.getEmail(), user.getRole());
        log.info("Mot de passe chargé : {}", user.getPassword());

        Role userRole = user.getRole();
        if (userRole == null) {
            log.error("L'utilisateur {} n'a pas de rôle valide.", email);
            throw new UsernameNotFoundException("L'utilisateur n'a pas de rôle valide.");
        }

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + userRole.name());
        log.info("Autorité attribuée : {}", authority);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(authority)
        );
    }*/
}

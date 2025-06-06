package GestionCours.backend.springboot.security;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.RestController;



import GestionCours.backend.springboot.Entity.Admin;

import GestionCours.backend.springboot.Entity.Apprenant;

import GestionCours.backend.springboot.Entity.Enseignant;

import GestionCours.backend.springboot.Entity.Parametre;

import GestionCours.backend.springboot.Entity.Role;

import GestionCours.backend.springboot.Entity.User;

import GestionCours.backend.springboot.Exception.accountNotFoundException;

import GestionCours.backend.springboot.Repositrory.UserRepository;
import GestionCours.backend.springboot.Services.EmailService;
import GestionCours.backend.springboot.Services.UserServiceImpl;

import jakarta.servlet.http.Cookie;

import jakarta.servlet.http.HttpServletResponse;




@RestController

@RequestMapping("/auth")

@CrossOrigin(origins = "http://localhost:3000")



public class AuthController {



    @Autowired

    private  AuthenticationManager authenticationManager;

    private  UserRepository userrepositroy;

    private JwtUtils jwtUtil;

    private  UserDetailsService userDetailsService;

    private  UserServiceImpl userServices;

    private  PasswordEncoder passwordEncoder;
    private final EmailService emailService;


    private static final Logger log = LoggerFactory.getLogger(AuthController.class);



    public AuthController(AuthenticationManager authenticationManager, UserRepository userrepositroy, JwtUtils jwtUtil,

                          UserDetailsService userDetailsService, UserServiceImpl userServices, 

                          PasswordEncoder passwordEncoder,EmailService emailService) {

        this.authenticationManager = authenticationManager;

        this.userrepositroy = userrepositroy;

        this.jwtUtil = jwtUtil;

        this.userDetailsService = userDetailsService;

        this.userServices = userServices;

        this.passwordEncoder = passwordEncoder;
        this.emailService=emailService;

    }



    @PostMapping("/login")

    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletResponse response) {

        String email = loginRequest.get("email");

        String password = loginRequest.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {



            log.error("Email ou mot de passe manquant lors de la tentative de connexion.");

            return ResponseEntity.badRequest().body(Map.of("message", "Email ou mot de passe manquant"));

        }

        log.info("Tentative d'authentification pour l'email: {}", email);



        try {

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);



            String accessToken = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities());

            String refreshToken = jwtUtil.generateRefreshToken(userDetails.getUsername(), userDetails.getAuthorities());



            // Ajouter les tokens dans des cookies HttpOnly

            Cookie accessTokenCookie = new Cookie("accessToken", accessToken);

            accessTokenCookie.setHttpOnly(true);

            accessTokenCookie.setSecure(true); // Seulement en HTTPS

            accessTokenCookie.setPath("/");

            accessTokenCookie.setMaxAge(60 * 60); // 1 heure

            response.addCookie(accessTokenCookie);



            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);

            refreshTokenCookie.setHttpOnly(true);

            refreshTokenCookie.setSecure(true);

            refreshTokenCookie.setPath("/");

            refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7 jours

            response.addCookie(refreshTokenCookie);



            Map<String, Object> responseBody = Map.of(

            		 "accessToken", accessToken,

                     "refreshToken", refreshToken,

                "roles", userDetails.getAuthorities().stream()

                

                    .map(GrantedAuthority::getAuthority)

                    .collect(Collectors.toList()),

                "email", userDetails.getUsername()

            );



            log.info("Connexion réussie pour l'email: {}", email);

            return ResponseEntity.ok(responseBody);

        } catch (AuthenticationException e) {

            //log.error("Échec de l'authentification pour l'email {}: {}", email, e.getMessage());



               log.error( e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Identifiants invalides"));

        }

    }

   

    /*@PostMapping("/login")

    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletResponse response) {

        String email = loginRequest.get("email");

        String password = loginRequest.get("password");



        // Vérifier les champs

        if (email == null || email.isBlank() || password == null || password.isBlank()) {

            log.error("Email ou mot de passe manquant lors de la tentative de connexion.");

            return ResponseEntity.badRequest().body(Map.of("message", "Email ou mot de passe manquant"));

        }



        // Vérifier si le mot de passe semble être un hachage BCrypt

        if (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$")) {

            log.error("Le mot de passe fourni semble être un hachage, un mot de passe brut est requis. Email: {}", email);

            return ResponseEntity.badRequest().body(Map.of("message", "Le mot de passe doit être brut, non haché"));

        }



        log.info("Tentative d'authentification pour l'email: {}", email);

        log.debug("Mot de passe brut envoyé: {}", password); // À retirer en production



        try {

            // Authentifier l'utilisateur

            Authentication authentication = authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(email, password)

            );

            SecurityContextHolder.getContext().setAuthentication(authentication);



            // Charger les détails de l'utilisateur

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            log.info("Utilisateur authentifié avec succès: {}", userDetails.getUsername());



            // Générer les tokens JWT

            String accessToken = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities());

            String refreshToken = jwtUtil.generateRefreshToken(userDetails.getUsername(), userDetails.getAuthorities());



            // Ajouter les tokens dans des cookies HttpOnly

            Cookie accessTokenCookie = new Cookie("accessToken", accessToken);

            accessTokenCookie.setHttpOnly(true);

            accessTokenCookie.setSecure(true);

            accessTokenCookie.setPath("/");

            accessTokenCookie.setMaxAge(60 * 60); // 1 heure

            response.addCookie(accessTokenCookie);



            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);

            refreshTokenCookie.setHttpOnly(true);

            refreshTokenCookie.setSecure(true);

            refreshTokenCookie.setPath("/");

            refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7 jours

            response.addCookie(refreshTokenCookie);



            // Préparer la réponse

            Map<String, Object> responseBody = Map.of(

                "roles", userDetails.getAuthorities().stream()

                    .map(GrantedAuthority::getAuthority)

                    .collect(Collectors.toList()),

                "email", userDetails.getUsername()

            );



            log.info("Connexion réussie pour l'email: {}", email);

            return ResponseEntity.ok(responseBody);

        } catch (BadCredentialsException e) {

            log.error("Échec de l'authentification pour l'email {}: Mot de passe incorrect", email);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Identifiants invalides"));

        } catch (UsernameNotFoundException e) {

            log.error("Échec de l'authentification pour l'email {}: Utilisateur non trouvé", email);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Utilisateur non trouvé"));

        } catch (AuthenticationException e) {

            log.error("Échec de l'authentification pour l'email {}: {}", email, e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Erreur d'authentification: " + e.getMessage()));

        }

    }*/

    @PostMapping("/signup")

    public ResponseEntity<Map<String, Object>> inscription(@RequestBody Map<String, String> demandeInscription) {

        // Extraire les champs

        String nom = demandeInscription.get("nom");

        String prenom = demandeInscription.get("prenom");

        String email = demandeInscription.get("email");

        String password = demandeInscription.get("password");

        String confirm_password = demandeInscription.get("confirm_password");

        String cle = demandeInscription.get("cle");

     // Normaliser l'email

        if (email != null) {

            email = email.trim().toLowerCase();

        }

        



        // Vérifier les champs

        StringBuilder missingFields = new StringBuilder();

        if (nom == null || nom.isBlank()) missingFields.append("nom, ");

        if (prenom == null || prenom.isBlank()) missingFields.append("prenom, ");

        if (email == null || email.isBlank()) missingFields.append("email, ");

        if (password == null || password.isBlank()) missingFields.append("password, ");

        if (confirm_password == null || confirm_password.isBlank()) missingFields.append("confirm_password, ");

        if (cle == null || cle.isBlank()) missingFields.append("cle, ");



        if (!missingFields.isEmpty()) {

            log.error("Champs manquants ou vides : {}", missingFields.toString());

            return ResponseEntity.badRequest().body(Map.of("message", "Tous les champs sont requis : " + missingFields.toString()));

        }



        // Vérifier que les mots de passe correspondent

        if (!password.equals(confirm_password)) {

            log.warn("Les mots de passe ne correspondent pas pour l'email : {}", email);

            return ResponseEntity.badRequest().body(Map.of("message", "Les mots de passe ne correspondent pas"));

        }

        // Valider le mot de passe

        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!])[\\w@#$%^&+=!]{8,}$";

        if (!password.matches(passwordRegex)) {

            log.warn("Mot de passe invalide pour l'email : {}", email);

            return ResponseEntity.badRequest().body(Map.of("message", "Le mot de passe doit comporter au moins 8 caractères incluant une majuscule, une minuscule, un chiffre et un caractère spécial."));

        }

        // Déterminer le rôle à partir de la clé

        Role role;

        try {

            role = determineRoleFromCle(cle);

        } catch (IllegalArgumentException e) {

            log.error("Clé invalide pour l'email {} : {}", email, cle);

            return ResponseEntity.badRequest().body(Map.of("message", "Clé invalide : " + e.getMessage()));

        }



     // Vérifier si l'email existe déjà

        try {

            log.info("Vérification de l'existence de l'email : {}", email);

            userServices.getUserByEmail(email);

            log.warn("Email déjà utilisé : {}", email);

            return ResponseEntity.badRequest().body(Map.of("message", "Cet email est déjà utilisé"));

        } catch (accountNotFoundException e) {

            log.info("Email disponible : {}", email);

            // L'exception indique que l'utilisateur n'existe pas, donc on peut continuer

        } catch (Exception e) {

            log.error("Erreur lors de la vérification de l'email {} : {}", email, e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                .body(Map.of("message", "Erreur lors de la vérification de l'email : " + e.getMessage()));

        }



    

     // Créer l'utilisateur

        User nouvelUtilisateur = createUserSubclass(role);

        nouvelUtilisateur.setNom(nom);

        nouvelUtilisateur.setPrenom(prenom);

        nouvelUtilisateur.setEmail(email);



        // Afficher le mot de passe en clair avant encodage

        log.info("Mot de passe en clair avant encodage : {}", password);



        String encodedPassword = passwordEncoder.encode(password);

        nouvelUtilisateur.setPassword(encodedPassword);

        log.info("Mot de passe encodé avant enregistrement : {}", nouvelUtilisateur.getPassword());

       // userServices.addUser(nouvelUtilisateur);

        nouvelUtilisateur.setCle(cle);

        nouvelUtilisateur.setRole(role); // Définir le rôle sous forme de String (ROLE_XXX)



        // Champs spécifiques

       if (nouvelUtilisateur instanceof Apprenant) {

            ((Apprenant) nouvelUtilisateur).setNiveau(demandeInscription.getOrDefault("niveau", "Débutant"));

            ((Apprenant) nouvelUtilisateur).setEstInscrit(false);

        } else if (nouvelUtilisateur instanceof Enseignant) {

            ((Enseignant) nouvelUtilisateur).setSpecialite(demandeInscription.getOrDefault("specialite", "Non spécifié"));

        }



        // Enregistrer l'utilisateur

        try {

            userServices.addUser(nouvelUtilisateur);

            log.info("Utilisateur inscrit avec succès : {}", email);



            // Générer un token JWT

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            String accessToken = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities());

            String refreshToken = jwtUtil.generateRefreshToken(userDetails.getUsername(), userDetails.getAuthorities());



            Map<String, Object> response = Map.of(

                "message", "Inscription réussie",

                "accessToken", accessToken,

                "refreshToken", refreshToken,

                "cles", userDetails.getAuthorities().stream()

                    .map(GrantedAuthority::getAuthority)

                    .collect(Collectors.toList()),

                "email", userDetails.getUsername()

            );



            return ResponseEntity.ok(response);

        } catch (Exception e) {

            log.error("Erreur lors de l'inscription pour l'email {} : {}", email, e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)

                .body(Map.of("message", "Erreur lors de l'inscription : " + e.getMessage()));

        }

    }

    @GetMapping("/validate")

    public ResponseEntity<Map<String, Object>> validateToken(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {

            log.error("Utilisateur non authentifié pour la validation du token.");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)

                .body(Map.of("message", "Utilisateur non authentifié"));

        }



        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        log.info("Token valide pour l'email: {}", userDetails.getUsername());



        return ResponseEntity.ok(Map.of(

            "email", userDetails.getUsername(),

            "roles", userDetails.getAuthorities().stream()

                .map(GrantedAuthority::getAuthority)

                .collect(Collectors.toList())

        ));

    }



    @PostMapping("/logout")

    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse response) {

        // Nettoyer les cookies

        Cookie accessTokenCookie = new Cookie("accessToken", null);

        accessTokenCookie.setHttpOnly(true);

        accessTokenCookie.setSecure(false); // Désactivé pour localhost

        accessTokenCookie.setPath("/");

        accessTokenCookie.setMaxAge(0); // Supprime le cookie

        response.addCookie(accessTokenCookie);



        Cookie refreshTokenCookie = new Cookie("refreshToken", null);

        refreshTokenCookie.setHttpOnly(true);

        refreshTokenCookie.setSecure(false); // Désactivé pour localhost

        refreshTokenCookie.setPath("/");

        refreshTokenCookie.setMaxAge(0); // Supprime le cookie

        response.addCookie(refreshTokenCookie);



        SecurityContextHolder.clearContext();

        log.info("Utilisateur déconnecté avec succès.");

        return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));

    }



    @GetMapping("/verifyRole")

    public ResponseEntity<?> verifyRole(@RequestParam String cle) {

        try {

            Role role = determineRoleFromCle(cle);

            return ResponseEntity.ok(Map.of("role", role.name()));

        } catch (IllegalArgumentException e) {

            log.error("Clé invalide : {}", cle);

            return ResponseEntity.badRequest().body(Map.of("message", "Clé invalide : " + e.getMessage()));

        }

    }



    @PostMapping("/refresh")

    public ResponseEntity<Map<String, Object>> refreshAccessToken(@RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || refreshToken.isBlank()) {

            log.error("Token de rafraîchissement manquant.");

            return ResponseEntity.badRequest().body(Map.of("message", "Token de rafraîchissement manquant"));

        }



        try {

            String email = jwtUtil.extractEmail(refreshToken);

            if (!jwtUtil.validateToken(refreshToken, email)) {

                log.error("Token de rafraîchissement invalide pour l'email : {}", email);

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)

                    .body(Map.of("message", "Token de rafraîchissement invalide"));

            }



            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            String nouveauAccessToken = jwtUtil.generateToken(email, userDetails.getAuthorities());



            return ResponseEntity.ok(Map.of("accessToken", nouveauAccessToken));

        } catch (Exception e) {

            log.error("Erreur lors de la validation du refresh token : {}", e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)

                .body(Map.of("message", "Token de rafraîchissement expiré ou corrompu"));

        }

    }



    private User createUserSubclass(Role role) {

        switch (role) {

            case ADMIN:

                return new Admin();

            case APPRENANT:

                return new Apprenant();

            case ENSEIGNANT:

                return new Enseignant();

            default:

                throw new IllegalArgumentException("Rôle non reconnu : " + role);

        }

    }



    public Role determineRoleFromCle(String cle) {

        if (cle == null || cle.isEmpty()) {

            throw new IllegalArgumentException("Clé non fournie");

        }

        String cleLower = cle.toLowerCase();

        if (cleLower.equals(Parametre.cleApprenant)) {

            return Role.APPRENANT;

        } else if (cleLower.equals(Parametre.cleEnseignant)) {

            return Role.ENSEIGNANT;

        } else if (cleLower.equals(Parametre.cleAdmin)) {

            return Role.ADMIN;

        } else {

            throw new IllegalArgumentException("Clé non reconnue : " + cle);

        }

    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email requis"));
        }

        try {
            User user = userServices.getUserByEmail(email);
            
            // Générer un token de réinitialisation (valide 15 min)
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
            userServices.updateUser(user);
            
            // Envoyer l'email (simulé ici par un log)
            log.info("Lien de réinitialisation pour {} : http://localhost:3000/reset-password?token={}", 
                     email, resetToken);
            
            return ResponseEntity.ok(Map.of("message", "Email de réinitialisation envoyé"));
        } catch (accountNotFoundException e) {
            // Ne pas révéler que l'email n'existe pas
            log.info("Demande de réinit pour email inconnu : {}", email);
            return ResponseEntity.ok(Map.of("message", "Si l'email existe, un lien a été envoyé"));
        }
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");
        
        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token et mot de passe requis"));
        }

        try {
            User user = userServices.findByResetToken(token);
            
            // Vérifier la validité du token
            if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Token expiré"));
            }
            
            // Valider le nouveau mot de passe
            String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!])[\\w@#$%^&+=!]{8,}$";
            if (!newPassword.matches(passwordRegex)) {
                return ResponseEntity.badRequest().body(Map.of("message", 
                    "Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"));
            }
            
            // Mettre à jour le mot de passe
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userServices.updateUser(user);
            
            return ResponseEntity.ok(Map.of("message", "Mot de passe réinitialisé avec succès"));
        } catch (accountNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Token invalide"));
        }
    }

}


package GestionCours.backend.springboot.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {


    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(UserDetailsService userDetailsService, JwtUtils jwtUtils) {
        this.userDetailsService = userDetailsService;
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwtUtils, userDetailsService);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Use the CORS config
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow all OPTIONS requests
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers("/uploads/**").permitAll()
            .requestMatchers("/api/choisir/niveaux-chapitres").permitAll() // 👈 AJOUTE CETTE LIGNE
            .requestMatchers("/*").permitAll() // 👈 AJOUTE CETTE LIGNE
            .requestMatchers("/api/element-cours/addElementCours").hasAnyRole("ADMIN","APPRENANT", "ENSEIGNANT")
             .requestMatchers("/users/**").permitAll()
 .requestMatchers("/api/element/v1/getByEspaceCoursId/**").permitAll()
  .requestMatchers("api/type-element/**").permitAll()

            		.requestMatchers("/auth/validate").authenticated()

            		.requestMatchers("/admin/**").permitAll()
            		.requestMatchers("/api/choisir/**").permitAll()

            		.requestMatchers("/users/**").permitAll()

                .requestMatchers("/api/apprenant/**").hasAnyAuthority("APP_AI_BASIC", "APP_DATA_VIEW")

                .requestMatchers("/api/enseignant/**").hasAnyAuthority("ENS_AI_ADVANCED", "ENS_DATA_MANAGE")
                
                // Type Element endpoints - specific before general
                .requestMatchers("/api/type-element/getAllTypeElements").permitAll()
                .requestMatchers("/api/type-element/**").hasAnyRole("ADMIN")
                
                // Espace Cours endpoints
                .requestMatchers("/api/espaceCours/tablcour").permitAll()
                .requestMatchers("/api/espacecours/getAllespacecours").permitAll()
                
                // Element endpoints - most specific first
                .requestMatchers("/api/element/v1/getByEspaceCoursId/**").permitAll()
                .requestMatchers("/api/element-cours/v1/getByEspaceCoursId/**").permitAll()
                .requestMatchers("/api/element/*/download").hasAnyRole("APPRENANT", "ENSEIGNANT", "ADMIN")
                .requestMatchers("/api/element/*/download-info").hasAnyRole("APPRENANT", "ENSEIGNANT", "ADMIN")
                .requestMatchers("/api/element/upload").hasAnyRole("ENSEIGNANT", "ADMIN")
                // This catch-all for /api/element/** should come last
                .requestMatchers("/api/element/**").hasAnyRole("APPRENANT", "ENSEIGNANT", "ADMIN")
               
                .requestMatchers("/api/espacecours/getAllespacecours").hasAnyRole("APPRENANT", "ENSEIGNANT", "ADMIN")
                 
                .requestMatchers("/users/all").hasRole("ADMIN") // Restrict /users/all to ADMIN

                .requestMatchers("/users/activate/**").hasRole("ADMIN") // Restrict activate endpoint

                .requestMatchers("/users/block/**").hasRole("ADMIN") // Restrict block endpoint

                .requestMatchers("/users/rejetee/**").hasRole("ADMIN") // Restrict reject endpoint

                .requestMatchers("/users/unblock/**").hasRole("ADMIN") // Restrict unblock endpoint
                .requestMatchers("/users/delete/**").hasRole("ADMIN")

            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}  @Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Specific origin
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
    configuration.setAllowCredentials(true); // Crucial for credentials
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

}
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

            		.requestMatchers("/auth/validate").authenticated()

            		.requestMatchers("/admin/**").permitAll()
            		.requestMatchers("/api/choisir/**").permitAll()

            		.requestMatchers("/users/**").permitAll()

                .requestMatchers("/api/apprenant/**").hasAnyAuthority("APP_AI_BASIC", "APP_DATA_VIEW")

                .requestMatchers("/api/enseignant/**").hasAnyAuthority("ENS_AI_ADVANCED", "ENS_DATA_MANAGE")
                  .requestMatchers("/api/type-element/**").hasRole("ADMIN")
                .requestMatchers("/api/type-element/getAllTypeElements").hasRole("APPRENANT")
                .requestMatchers("/api/type-element/getAllTypeElements").hasRole("ENSEIGNANT")
                .requestMatchers("/api/type-element/getAllTypeElements").hasRole("ADMIN")
                
                .requestMatchers("/api/espacecours/getAllespacecours").hasRole("APPRENANT")
                .requestMatchers("/api/espacecours/getAllespacecours").hasRole("ENSEIGNANT")
                .requestMatchers("/api/espacecours/getAllespacecours").hasRole("ADMIN")
                
                
                .requestMatchers("/api/element/*/download").hasRole("APPRENANT")
                .requestMatchers("/api/element/*/download").hasRole("ENSEIGNANT")
                
                .requestMatchers("/api/element/*/download-info").hasRole("APPRENANT")
                .requestMatchers("/api/element/*/download-info").hasRole("ENSEIGNANT")
                
                .requestMatchers("/api/espaceCours/tablcour").authenticated()
                .requestMatchers("/api/element/upload").hasRole("ADMIN")
                .requestMatchers("/api/element/**").hasRole("ADMIN")
               
                .requestMatchers("/api/espacecours/getAllespacecours").hasRole("ENSEIGNANT")
                 
                .requestMatchers("/users/all").hasRole("ADMIN") // Restrict /users/all to ADMIN

                .requestMatchers("/users/activate/**").hasRole("ADMIN") // Restrict activate endpoint

                .requestMatchers("/users/block/**").hasRole("ADMIN") // Restrict block endpoint

                .requestMatchers("/users/rejetee/**").hasRole("ADMIN") // Restrict reject endpoint

                .requestMatchers("/users/unblock/**").hasRole("ADMIN") // Restrict unblock endpoint

                .requestMatchers("/users/delete/**").hasRole("ADMIN")
                .requestMatchers("/api/espaceCours/tablcour").authenticated()
                .requestMatchers("/api/type-element/**").authenticated()

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
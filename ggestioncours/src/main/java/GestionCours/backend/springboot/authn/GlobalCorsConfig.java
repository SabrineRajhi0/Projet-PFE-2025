package GestionCours.backend.springboot.authn;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GlobalCorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            // Pour Spring Boot 2.7+ ou supérieur
            .allowedOriginPatterns(
            		"http://localhost:3000"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
            .allowedHeaders(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With"
            )
            .exposedHeaders(
                "Authorization",
                "Content-Disposition"
            )
            .allowCredentials(true)
            .maxAge(3600);
    }
}

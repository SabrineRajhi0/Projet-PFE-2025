package GestionCours.backend.springboot.security;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.apache.logging.log4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
	//private static final Logger log = LoggerFactory.getLogger(JwtUtils.class);
	private static final org.slf4j.Logger log = LoggerFactory.getLogger(JwtUtils.class);
    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60 * 10; // 10 heures
    private static final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7; // 7 jours

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String generateToken(String email, Collection<? extends GrantedAuthority> authorities) {
    	log.debug("Génération du jeton pour l'email : {}, autorités : {}", email, authorities);
        if (email == null || authorities == null) {
            log.error("Email ou autorités null lors de la génération du jeton");
            throw new IllegalArgumentException("Email ou autorités ne peuvent pas être null");
        }
        List<String> roleNames = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        log.debug("Rôles extraits : {}", roleNames);

        String token = Jwts.builder()
                .setSubject(email)
                .claim("roles", roleNames)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(SECRET_KEY)
                .compact();
        log.debug("Jeton d'accès généré : {}", token);
        return token;
    }
    public String generateRefreshToken(String email, Collection<? extends GrantedAuthority> authorities) {
    	log.debug("Génération du jeton de rafraîchissement pour l'email : {}, autorités : {}", email, authorities);
        if (email == null || authorities == null) {
            log.error("Email ou autorités null lors de la génération du jeton de rafraîchissement");
            throw new IllegalArgumentException("Email ou autorités ne peuvent pas être null");
        }
        List<String> roleNames = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        log.debug("Rôles extraits : {}", roleNames);

        String token = Jwts.builder()
                .setSubject(email)
                .claim("roles", roleNames)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(SECRET_KEY)
                .compact();
        log.debug("Jeton de rafraîchissement généré : {}", token);
        return token;
    }

    public boolean validateToken(String token, String email, Collection<String> requiredRoles) {
        try {
            final String emailFromToken = extractEmail(token);
            final List<String> rolesFromToken = getRolesFromToken(token);
            
            // Vérifier l'email, l'expiration et les rôles
            boolean isValid = emailFromToken.equals(email) 
                    && !isTokenExpired(token)
                    && (requiredRoles == null || rolesFromToken.containsAll(requiredRoles));
            
            if (!isValid) {
                log.warn("Validation du jeton échouée : email={}, rôles attendus={}, rôles dans le jeton={}", 
                        email, requiredRoles, rolesFromToken);
            }
            return isValid;
        } catch (Exception e) {
            log.error("Erreur lors de la validation du jeton : {}", e.getMessage());
            return false;
        }
    }

    public boolean validateToken(String token, String email) {
        final String emailFromToken = extractEmail(token);
        return (emailFromToken.equals(email) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    @SuppressWarnings("unchecked")
	public List<String> getRolesFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("roles", List.class);
    }
}
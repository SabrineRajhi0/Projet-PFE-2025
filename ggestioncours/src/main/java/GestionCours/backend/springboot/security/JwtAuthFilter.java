package GestionCours.backend.springboot.security;



import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import GestionCours.backend.springboot.Services.MyUsrDetailsService;
import org.springframework.util.StringUtils;
import java.io.IOException;



@Component

public class JwtAuthFilter extends OncePerRequestFilter {



	@Autowired

    private JwtUtils jwtUtils;

	@Autowired

    private  UserDetailsService userDetailsService;

    private static final long INACTIVITY_TIMEOUT = 10 * 60 * 1000;



    

    public JwtAuthFilter(JwtUtils jwtUtils, UserDetailsService userDetailsService) {

		this.jwtUtils=jwtUtils;

		this.userDetailsService=userDetailsService;

	}

    @Override

    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getRequestURI();

        return path.equals("/auth/login") || path.equals("/auth/signup");

    }/*

	@Override

    protected void doFilterInternal(

            @NonNull HttpServletRequest request,

            @NonNull HttpServletResponse response,

            @NonNull FilterChain filterChain

    ) throws ServletException, IOException {

        try {

            String jwt = parseJwt(request);

            

            //if (jwt != null && jwtUtils.validateToken(jwt, jwt)) {

            if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                String email = jwtUtils.extractEmail(jwt);



                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                

                if (userDetails != null) {

                    UsernamePasswordAuthenticationToken authentication =

                            new UsernamePasswordAuthenticationToken(

                                    userDetails,

                                    null,

                                    userDetails.getAuthorities());

                    

                    authentication.setDetails(

                            new WebAuthenticationDetailsSource().buildDetails(request)

                    );

                    

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                }

            }

        } catch (Exception e) {

            logger.error("Failed to set user authentication", e);

            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");

            return;

        }



        filterChain.doFilter(request, response);

    }



    private String parseJwt(HttpServletRequest request) {

        String headerAuth = request.getHeader("Authorization");

        

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {

            return headerAuth.substring(7);

        }

        

        return null;

    }*/

    @Override

    protected void doFilterInternal(

            @NonNull HttpServletRequest request,

            @NonNull HttpServletResponse response,

            @NonNull FilterChain filterChain

    ) throws ServletException, IOException {

        try {

            String jwt = parseJwt(request);



            if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                String email = jwtUtils.extractEmail(jwt);



                if (email != null) {

                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    if (userDetails != null && jwtUtils.validateToken(jwt, email)) {

                        UsernamePasswordAuthenticationToken authentication =

                                new UsernamePasswordAuthenticationToken(

                                        userDetails,

                                        null,

                                        userDetails.getAuthorities());



                        authentication.setDetails(

                                new WebAuthenticationDetailsSource().buildDetails(request)

                        );



                        SecurityContextHolder.getContext().setAuthentication(authentication);

                    } else {

                        logger.warn("Validation du token échouée pour l'email: {}");

                    }

                }

            }

        } catch (Exception e) {

            logger.error("Échec de l'authentification de l'utilisateur: {}");

            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Échec de l'authentification");

            return;

        }



        filterChain.doFilter(request, response);

    }

    



    private String parseJwt(HttpServletRequest request) {

        String headerAuth = request.getHeader("Authorization");



        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {

            return headerAuth.substring(7);

        }



        return null;

    }

    

}
package GestionCours.backend.springboot.Entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Transient;




@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)//tasneaaleli men kol classe fille table
public abstract  class  User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)// je change cette strategy de genarate idetiffy par auto car ne pas compatbile avec table-per-class
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;
    
    
    






    //@NotNull
   
    //@Column(nullable = false)
    @Column(name = "password", nullable = false)
    private String password;

   // private boolean isActive;

    @Transient
    private String confirm_password;
    @Enumerated(EnumType.STRING)
    private Role role;
    private String cle;
    
    
    
    @Enumerated(EnumType.STRING) // Stocke le nom de l'enum en DB (ex: "ACTIVE")

    private UserStatus status = UserStatus.PENDING; // Valeur par défaut



    private String blockedReason;    // Raison du blocage

    private LocalDateTime blockedAt; // Date du blocage

    private String rejectionReason;  // Raison du rejet


    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    @Column(name = "created_at", updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonProperty("createdAt")
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
      public User() {}



	public User( String nom, String prenom, String email,String pwd,Role role,String cle) {

        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password=pwd;
        this.role=role;
        this.cle=cle;
        
        

    }








	public Long getId() {
		return id;
	}








	public void setId(Long id) {
		this.id = id;
	}








	public String getNom() {
		return nom;
	}








	public void setNom(String nom) {
		this.nom = nom;
	}








	public String getPrenom() {
		return prenom;
	}








	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}








	public String getEmail() {
		return email;
	}








	public void setEmail(String email) {
		this.email = email;
	}








	public String getPassword() {
		return password;
	}








	public void setPassword(String password) {
		this.password = password;
	}








	public String getConfirm_password() {
		return confirm_password;
	}








	public void setConfirm_password(String confirm_password) {
		this.confirm_password = confirm_password;
	}








	public Role getRole() {
		return role;
	}








	public void setRole(Role role) {
		this.role = role;
	}



	public String getCle() {
		return cle;
	}



	public void setCle(String cle) {
		this.cle = cle;
	}



	public UserStatus getStatus() {
		return status;
	}



	public void setStatus(UserStatus status) {
		this.status = status;
	}



	public String getBlockedReason() {
		return blockedReason;
	}



	public void setBlockedReason(String blockedReason) {
		this.blockedReason = blockedReason;
	}



	public LocalDateTime getBlockedAt() {
		return blockedAt;
	}



	public void setBlockedAt(LocalDateTime blockedAt) {
		this.blockedAt = blockedAt;
	}



	public String getRejectionReason() {
		return rejectionReason;
	}



	public void setRejectionReason(String rejectionReason) {
		this.rejectionReason = rejectionReason;
	}



	public String getResetToken() {
		return resetToken;
	}



	public void setResetToken(String resetToken) {
		this.resetToken = resetToken;
	}



	public LocalDateTime getResetTokenExpiry() {
		return resetTokenExpiry;
	}



	public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
		this.resetTokenExpiry = resetTokenExpiry;
	}
	









    //public LocalDate getDatenaissance() { return datenaissance; }
   // public void setDatenaissance(LocalDate datenaissance) { this.datenaissance = datenaissance; }


}




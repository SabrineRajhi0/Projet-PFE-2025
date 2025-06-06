package GestionCours.backend.springboot.Entity;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;




@Entity
@Table(name = "element_cours")

public class ElementCours {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEC;
    
    private boolean visibleEC;
    
   
    private int ordreEC;
    
    @Column(name = "date_ajout_ec", nullable = true, updatable = false)
    private LocalDate dateAjoutEC;
    
    private String dateLimite;
    
    
   

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_espc", nullable = false)
    @JsonIgnoreProperties({"elementsCours", "elements", "chapitres"})
    private EspaceCours espaceCours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_elt", nullable = false)
    @JsonIgnoreProperties({"elementsCours", "espaceCours"})
    private Element element;
    
    
    @PrePersist
    public void prePersist() {
        this.dateAjoutEC = LocalDate.now();
    }
    
    
    // Constructeurs
    public ElementCours() {}

	public ElementCours(Long idEC, boolean visibleEC, int ordreEC, LocalDate dateAjoutEC, String dateLimite,
 EspaceCours espaceCours, Element element) {
	
		this.idEC = idEC;
		this.visibleEC = visibleEC;
		this.ordreEC = ordreEC;
		this.dateAjoutEC = dateAjoutEC;
		this.dateLimite = dateLimite;
		this.espaceCours = espaceCours;
		this.element = element;
	}
	
	// getters et setters 

	public Long getIdEC() {
		return idEC;
	}

	public void setIdEC(Long idEC) {
		this.idEC = idEC;
	}

	public boolean isVisibleEC() {
		return visibleEC;
	}

	public void setVisibleEC(boolean visibleEC) {
		this.visibleEC = visibleEC;
	}

	public int getOrdreEC() {
		return ordreEC;
	}

	public void setOrdreEC(int ordreEC) {
		this.ordreEC = ordreEC;
	}

	public LocalDate getDateAjoutEC() {
		return dateAjoutEC;
	}

	public void setDateAjoutEC(LocalDate dateAjoutEC) {
		this.dateAjoutEC = dateAjoutEC;
	}

	public String getDateLimite() {
		return dateLimite;
	}

	public void setDateLimite(String dateLimite) {
		this.dateLimite = dateLimite;
	}

	public EspaceCours getEspaceCours() {
		return espaceCours;
	}

	public void setEspaceCours(EspaceCours espaceCours) {
		this.espaceCours = espaceCours;
		if (espaceCours != null && !espaceCours.getElementsCours().contains(this)) {
			espaceCours.getElementsCours().add(this);
		}
	}

	public Element getElement() {
		return element;
	}

	public void setElement(Element element) {
		this.element = element;
		if (element != null && !element.getElementsCours().contains(this)) {
			element.getElementsCours().add(this);
		}
	}

	public void setDateLimite(LocalDate localDate) {
		this.dateLimite = localDate != null ? localDate.toString() : null;
	}
}
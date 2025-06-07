package GestionCours.backend.springboot.Entity;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "element")
public class Element {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)


	private Long idElt;
    private String desElt; // Description
    private String cheminElt; // Chemin du fichier ou ressource
	
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_element_id", nullable = false)

    private TypeElement typeElement;
    @OneToMany(mappedBy = "element", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore

    private List<ElementCours> elementsCours = new ArrayList<>();


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "espace_cour_id")
    @JsonIgnore


    private EspaceCours espaceCours;
	public Element() {}
	public Element(Long idElt, String desElt, String cheminElt, TypeElement typeElement,
			List<ElementCours> elementsCours, EspaceCours espaceCours) {

		this.idElt = idElt;
		this.desElt = desElt;
		this.cheminElt = cheminElt;
		this.typeElement = typeElement;
		this.elementsCours = elementsCours != null ? elementsCours : new ArrayList<>();
		this.espaceCours = espaceCours;
	}



	public Long getIdElt() {
		return idElt;
	}

	public void setIdElt(Long idElt) {
		this.idElt = idElt;
	}

	public String getDesElt() {
		return desElt;
	}

	public void setDesElt(String desElt) {
		this.desElt = desElt;
	}

	public String getCheminElt() {
		return cheminElt;
	}

	public void setCheminElt(String cheminElt) {
		this.cheminElt = cheminElt;
	}

	public TypeElement getTypeElement() {
		return typeElement;
	}

	public void setTypeElement(TypeElement typeElement) {
		this.typeElement = typeElement;
	}

	public List<ElementCours> getElementsCours() {
		return elementsCours;
	}


	public void setElementsCours(List<ElementCours> elementsCours) {
		this.elementsCours = elementsCours;
	}

	public EspaceCours getEspaceCours() {
		return espaceCours;
	}

	public void setEspaceCours(EspaceCours espaceCours) {
		this.espaceCours = espaceCours;
	}

	public void addElementCours(ElementCours ec) {
	    if (ec != null) {
	        this.elementsCours.add(ec);
	        if (ec.getElement() != this) {
	            ec.setElement(this);
	        }
	    }
	}
    
}


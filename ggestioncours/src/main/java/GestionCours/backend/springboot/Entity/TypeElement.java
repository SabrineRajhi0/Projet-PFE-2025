package GestionCours.backend.springboot.Entity;


import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "type_element")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TypeElement {
    public enum SupportedTypes {
        IMAGE, PDF,  DOCUMENT_WORD
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTE;
    
    private String nomTE;  // This should store one of the SupportedTypes values
    
    @OneToMany(mappedBy = "typeElement")
    @JsonIgnore
    private List<Element> elements;

    // Constructors
    public TypeElement() {}

    public TypeElement(String nomTE) {
        this.nomTE = nomTE;
    }

    // Getters and Setters
    public Long getIdTE() {
        return idTE;
    }

    public void setIdTE(Long idTE) {
        this.idTE = idTE;
    }

    public String getNomTE() {
        return nomTE;
    }

    public void setNomTE(String nomTE) {
        // You can add validation here to ensure only supported types are set
        this.nomTE = nomTE;
    }

    public List<Element> getElements() {
        return elements;
    }

    public void setElements(List<Element> elements) {
        this.elements = elements;
    }
    
    // Helper method to check if type is valid
    public static boolean isValidType(String typeName) {
        try {
            SupportedTypes.valueOf(typeName.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}

package GestionCours.backend.springboot.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "espace_cours")
public class EspaceCours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idespac;

    private String titre;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    private Admin administrateurs;

    @OneToMany(mappedBy = "espaceCours", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Chapitre> chapitres;

    @ManyToOne
    private Enseignant enseignant;

    
    @OneToMany(mappedBy = "espaceCours", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @JsonManagedReference // Manages the forward reference
    private List<ElementCours> elementsCours = new ArrayList<>();

    @OneToMany(mappedBy = "espaceCours", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    //@JsonManagedReference
    
    @JsonIgnore
    private List<Element> elements = new ArrayList<>();

    // Constructors
    public EspaceCours() {}

    public EspaceCours(long idespac, String titre, String description, List<Chapitre> chapitres,
                       List<ElementCours> elementsCours) {
        this.idespac = idespac;
        this.titre = titre;
        this.description = description;
        this.chapitres = chapitres;
        this.elementsCours = elementsCours;
    }

    // Getters and Setters
    public long getIdespac() {
        return idespac;
    }

    public void setIdespac(long idespac) {
        this.idespac = idespac;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Chapitre> getChapitres() {
        return chapitres;
    }

    public void setChapitres(List<Chapitre> chapitres) {
        this.chapitres = chapitres;
    }

    public List<ElementCours> getElementsCours() {
        return elementsCours;
    }

    public void setElementsCours(List<ElementCours> elementsCours) {
        this.elementsCours = elementsCours;
    }

    public Admin getAdministrateurs() {
        return administrateurs;
    }

    public void setAdministrateurs(Admin administrateurs) {
        this.administrateurs = administrateurs;
    }

    public Enseignant getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        this.enseignant = enseignant;
    }

    public List<Element> getElements() {
        return elements;
    }

    public void setElements(List<Element> elements) {
        this.elements = elements;
    }
     
}
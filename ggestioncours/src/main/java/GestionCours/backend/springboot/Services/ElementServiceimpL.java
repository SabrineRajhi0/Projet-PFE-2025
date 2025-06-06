package GestionCours.backend.springboot.Services;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.Element;
import GestionCours.backend.springboot.Entity.ElementCours;
import GestionCours.backend.springboot.Entity.EspaceCours;
import GestionCours.backend.springboot.Entity.TypeElement;
import GestionCours.backend.springboot.Exception.ElementException;
import GestionCours.backend.springboot.Repositrory.ElementCoursRepository;
import GestionCours.backend.springboot.Repositrory.ElementRepository;
import GestionCours.backend.springboot.Repositrory.EspaceCoursRepository;
import GestionCours.backend.springboot.Repositrory.TypeElementRepository;



@Service
public class ElementServiceimpL implements ElementServiceInterface {

    @Autowired
    private ElementRepository elementRepository;

    @Autowired
    private TypeElementRepository typeElementRepository;

    @Autowired
    private ElementCoursRepository elementCoursRepository;

    @Autowired
    private EspaceCoursRepository espaceCoursRepository;
    
    // constructeur
     
    public ElementServiceimpL (ElementRepository elementRepository) {
    	this.elementRepository=elementRepository;
    }
    
    // Récupérer tous les éléments
    @Override
    public List<Element> getAllElements() {
        return elementRepository.findAll();
    }

    // Ajouter un élément
    @Override
    public Element addElement(Element element) {
        if (element.getDesElt() == null || element.getDesElt().trim().isEmpty()) {
            throw new RuntimeException("La description de l'élément ne peut pas être vide");
        }
        if (element.getCheminElt() == null || element.getCheminElt().trim().isEmpty()) {
            throw new RuntimeException("Le chemin de l'élément ne peut pas être vide");
        }
        if (element.getTypeElement() == null) {
            throw new RuntimeException("TypeElement est requis");
        }
        TypeElement typeElement = typeElementRepository.findById(element.getTypeElement().getIdTE())
            .orElseThrow(() -> new RuntimeException("TypeElement non trouvé avec l'ID : " + element.getTypeElement().getIdTE()));
        EspaceCours espaceCours = espaceCoursRepository.findById(element.getEspaceCours().getIdespac())
            .orElseThrow(() -> new RuntimeException("EspaceCours non trouvé avec l'ID : " + element.getEspaceCours().getIdespac()));
        element.setTypeElement(typeElement);
        element.setEspaceCours(espaceCours);
        return elementRepository.save(element);
    }

    // Récupérer un élément par ID
    @Override
    public Element getElementById(Long id) {
        return elementRepository.findById(id)
                .orElseThrow(() -> new ElementException("Élément avec ID " + id + " non trouvé"));
    }

    // Mettre à jour un élément
    @Override
    public Element updateElement(Long id, Element element) {
        Element existing = getElementById(id); // This will throw if not found
        validateElement(element);

        // Mettre à jour les champs
        existing.setDesElt(element.getDesElt());
        existing.setCheminElt(element.getCheminElt());
        existing.setTypeElement(element.getTypeElement());
        existing.setElementsCours(element.getElementsCours());

        return elementRepository.save(existing);
    }

    // Supprimer un élément
    @Override
    public void deleteElement(Long id) {
        // Vérifier si l'élément existe
        Element element = getElementById(id); // This will throw ElementException if not found

        // Supprimer les ElementCours associés (si cascade n'est pas configuré)
        List<ElementCours> relatedElementsCours = element.getElementsCours();
        if (!relatedElementsCours.isEmpty()) {
            elementCoursRepository.deleteAll(relatedElementsCours);
        }

        elementRepository.deleteById(id);
    }

    
    // Méthode de validation commune pour ajout et mise à jour
    private void validateElement(Element element) {
        // Validation des relations
        if (element.getTypeElement() == null || element.getTypeElement().getIdTE() == null) {
            throw new ElementException("Le type d'élément est requis avec un ID valide");
        }

        TypeElement typeElement = typeElementRepository.findById(element.getTypeElement().getIdTE())
                .orElseThrow(() -> new ElementException("TypeElement avec ID " + element.getTypeElement().getIdTE() + " non trouvé"));
        element.setTypeElement(typeElement);
    }
}
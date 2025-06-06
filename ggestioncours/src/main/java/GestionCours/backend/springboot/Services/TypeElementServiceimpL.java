package GestionCours.backend.springboot.Services;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.TypeElement;
import GestionCours.backend.springboot.Exception.TypeElementException;
import GestionCours.backend.springboot.Repositrory.TypeElementRepository;

@Service
public class TypeElementServiceimpL  implements TypeElementServiceInterface {

	
    @Autowired
    private TypeElementRepository typeElementRepository;

    
    // Récupérer tous les types d'éléments
	@Override
	public List<TypeElement> getAllTypeElements() {
    
        return typeElementRepository.findAll();

	}

	
    // Ajouter un type d'élément
	@Override
	public TypeElement addTypeElement(TypeElement typeElement) {
		// Validation des champs obligatoires
        if (typeElement.getNomTE() == null || typeElement.getNomTE().trim().isEmpty()) {
            throw new TypeElementException("Le nom du type d'élément est requis");
        }
        // Validation de la longueur maximale
        if (typeElement.getNomTE().length() > 255) {
            throw new TypeElementException("Le nom du type d'élément ne doit pas dépasser 255 caractères");
        }

        return typeElementRepository.save(typeElement);
    }

	
	

	// Récupérer un type d'élément par ID
    @Override
    public TypeElement getTypeElementById(Long id) {
        return typeElementRepository.findById(id)
                .orElseThrow(() -> new TypeElementException("Type d'élément avec ID " + id + " non trouvé"));
    }

    // Mettre à jour un type d'élément
    @Override
    public TypeElement updateTypeElement(Long id, TypeElement typeElement) {
        // Vérifier si le type d'élément existe
        TypeElement existing = typeElementRepository.findById(id)
                .orElseThrow(() -> new TypeElementException("Type d'élément avec ID " + id + " non trouvé"));

        // Validation des champs obligatoires
        if (typeElement.getNomTE() == null || typeElement.getNomTE().trim().isEmpty()) {
            throw new TypeElementException("Le nom du type d'élément est requis");
        }
        // Validation de la longueur maximale
        if (typeElement.getNomTE().length() > 255) {
            throw new TypeElementException("Le nom du type d'élément ne doit pas dépasser 255 caractères");
        }

        // Mettre à jour les champs
        existing.setNomTE(typeElement.getNomTE());

        return typeElementRepository.save(existing);
    }

    // Supprimer un type d'élément
    @Override
    public void deleteTypeElement(Long id) {
        // Vérifier si le type d'élément existe
        TypeElement typeElement = typeElementRepository.findById(id)
                .orElseThrow(() -> new TypeElementException("Type d'élément avec ID " + id + " non trouvé"));

        // Vérifier si des éléments sont associés
        if (typeElement.getElements() != null && !typeElement.getElements().isEmpty()) {
            throw new TypeElementException("Impossible de supprimer le type d'élément car des éléments y sont associés");
        }

        typeElementRepository.deleteById(id);
    }
}

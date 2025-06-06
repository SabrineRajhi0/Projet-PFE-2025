package GestionCours.backend.springboot.Services;


import java.util.List;

import GestionCours.backend.springboot.Entity.TypeElement;


public interface TypeElementServiceInterface {

	List<TypeElement> getAllTypeElements();

	TypeElement addTypeElement(TypeElement typeElement);

	TypeElement getTypeElementById(Long id);

	TypeElement updateTypeElement(Long id, TypeElement typeElement);

	void deleteTypeElement(Long id);

}

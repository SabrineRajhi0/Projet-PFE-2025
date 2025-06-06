package GestionCours.backend.springboot.Services;


import java.util.List;

import GestionCours.backend.springboot.Entity.Element;


public interface ElementServiceInterface {

	List<Element> getAllElements();

	Element addElement( Element element);

	Element getElementById(Long id);

	Element updateElement(Long id, Element element);

	void deleteElement(Long id);

}

package GestionCours.backend.springboot.Services;

import java.util.List;
import java.util.Optional;

import GestionCours.backend.springboot.Entity.Element;

public interface ElementServiceInterface1 {

    List<Element> getAllElements();

    Element addElement(Element element);

    Element getElementById(Long id);

    Element updateElement(Long id, Element element);

    void deleteElement(Long id);

    Element getElementByIdElt(Long idElt);

    Optional<Element> getFirstElementByEspaceCoursId(Long idespac); // 👈 ajout
}

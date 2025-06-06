package GestionCours.backend.springboot.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.Element;
import GestionCours.backend.springboot.Repositrory.ElementRepository1;

@Service
public class ElementServiceImpl1 implements ElementServiceInterface1 {

    @Autowired
    private ElementRepository1 elementRepository;

    @Override
    public List<Element> getAllElements() {
        return elementRepository.findAll();
    }

    @Override
    public Element addElement(Element element) {
        return elementRepository.save(element);
    }

    @Override
    public Element getElementById(Long id) {
        return elementRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteElement(Long id) {
        elementRepository.deleteById(id);
    }

    @Override
    public Element updateElement(Long id, Element element) {
        return elementRepository.save(element);
    }

    @Override
    public Element getElementByIdElt(Long idElt) {
        return elementRepository.findById(idElt).orElse(null);
    }

@Override
public Optional<Element> getFirstElementByEspaceCoursId(Long idEspaceCours) {
    return elementRepository.findTopByEspaceCoursIdespac(idEspaceCours);
}
}

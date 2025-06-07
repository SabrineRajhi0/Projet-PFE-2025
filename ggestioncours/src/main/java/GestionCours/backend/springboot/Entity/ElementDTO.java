package GestionCours.backend.springboot.Entity;


public class ElementDTO {

    private String description;
    private String cheminFichier;
    private String typeElement; // "PDF", "IMAGE", etc.
    private int ordreEC;//
    private boolean visibleEC;//
    private String dateLimite;//
    private Long idEspaceCours;//
    
    
    
    
    
    
    
 
    
	public ElementDTO() {
	}
	
	
	public ElementDTO(String description, String cheminFichier, String typeElement, int ordreEC, boolean visibleEC,
			String dateLimite, Long idEspaceCours) {
		this.description = description;
		this.cheminFichier = cheminFichier;
		this.typeElement = typeElement;
		this.ordreEC = ordreEC;
		this.visibleEC = visibleEC;
		this.dateLimite = dateLimite;
		this.idEspaceCours = idEspaceCours;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCheminFichier() {
		return cheminFichier;
	}
	public void setCheminFichier(String cheminFichier) {
		this.cheminFichier = cheminFichier;
	}
	public String getTypeElement() {
		return typeElement;
	}
	public void setTypeElement(String typeElement) {
		this.typeElement = typeElement;
	}
	public int getOrdreEC() {
		return ordreEC;
	}
	public void setOrdreEC(int ordreEC) {
		this.ordreEC = ordreEC;
	}
	public boolean isVisibleEC() {
		return visibleEC;
	}
	public void setVisibleEC(boolean visibleEC) {
		this.visibleEC = visibleEC;
	}
	public String getDateLimite() {
		return dateLimite;
	}
	public void setDateLimite(String dateLimite) {
		this.dateLimite = dateLimite;
	}
	public Long getIdEspaceCours() {
		return idEspaceCours;
	}
	public void setIdEspaceCours(Long idEspaceCours) {
		this.idEspaceCours = idEspaceCours;
	}
    
    
    
}

package GestionCours.backend.springboot.DTO;

import org.springframework.web.multipart.MultipartFile;

public class AjouterElementDTO {
    private Integer ordre;
    private String description;
    private Boolean visible;
    private Long typeId;
    private String dateLimite;
    private MultipartFile file;
    private long idespac;
    
    public AjouterElementDTO() {}
    
    public AjouterElementDTO(Integer ordre, String description, Boolean visible, Long typeId, String dateLimite,
            MultipartFile file, long idespac) {
        this.ordre = ordre;
        this.description = description;
        this.visible = visible;
        this.typeId = typeId;
        this.dateLimite = dateLimite;
        this.file = file;
        this.idespac = idespac;
    }

    public Integer getOrdre() {
        return ordre;
    }

    public void setOrdre(Integer ordre) {
        this.ordre = ordre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public Long getTypeId() {
        return typeId;
    }

    public void setTypeId(Long typeId) {
        this.typeId = typeId;
    }

    public String getDateLimite() {
        return dateLimite;
    }

    public void setDateLimite(String dateLimite) {
        this.dateLimite = dateLimite;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public long getIdespac() {
        return idespac;
    }

    public void setIdespac(long idespac) {
        this.idespac = idespac;
    }
} 
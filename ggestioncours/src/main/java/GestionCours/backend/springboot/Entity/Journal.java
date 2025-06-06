package GestionCours.backend.springboot.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

@Entity
public class Journal {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOpe;
    private LocalDateTime dateOpe;




	public Journal(Long idOpe, LocalDateTime dateOpe) {

		this.idOpe = idOpe;
		this.setDateOpe(dateOpe);

	}




	public LocalDateTime getDateOpe() {
		return dateOpe;
	}




	public void setDateOpe(LocalDateTime dateOpe) {
		this.dateOpe = dateOpe;
	}


}

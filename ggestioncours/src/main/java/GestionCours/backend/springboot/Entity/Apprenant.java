package GestionCours.backend.springboot.Entity;

import jakarta.persistence.Entity;



@Entity
public class Apprenant extends User {

    private String niveau;
    private double resultattest;
    private String typeCours;
    private boolean estInscrit;
    private int scoreTest;




public Apprenant() {}

    // Constructeur avec tous les attributs
    public Apprenant( String nom, String prenom, String email,String pwd,Role role ,String cle, String niveau, double resultattest,String typeCours,boolean estInscrit,int scoreTest) {
        super( nom, prenom, email,pwd,role,cle);
        this.niveau = niveau;
        this.resultattest = resultattest;
        this.typeCours=typeCours;
        this.estInscrit=estInscrit;
        this.scoreTest=scoreTest;

    }

	public String getNiveau() {
		return niveau;
	}

	public void setNiveau(String niveau) {
		this.niveau = niveau;
	}

	public double getResultattest() {
		return resultattest;
	}

	public void setResultattest(double resultattest) {
		this.resultattest = resultattest;
	}

	public String getTypeCours() {
		return typeCours;
	}

	public void setTypeCours(String typeCours) {
		this.typeCours = typeCours;
	}

	public boolean isEstInscrit() {
		return estInscrit;
	}

	public void setEstInscrit(boolean estInscrit) {
		this.estInscrit = estInscrit;
	}

	public int getScoreTest() {
		return scoreTest;
	}

	public void setScoreTest(int scoreTest) {
		this.scoreTest = scoreTest;
	}
	
	
	

}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const checkPasswordStrength = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[\w@#$%^&+=!]{8,}$/;
  return passwordRegex.test(password);
};

const checkEmailFormat = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailRegex.test(email);
};

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    confirmmotdepasse: "",
    cle: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "motdepasse") {
      setPasswordStrength(checkPasswordStrength(value) ? "Fort" : "Faible");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = "Nom requis";
    if (!formData.prenom) newErrors.prenom = "Prénom requis";
    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!checkEmailFormat(formData.email)) {
      newErrors.email = "L'email doit être une adresse Gmail valide (ex: nom@gmail.com)";
    }
    if (!formData.motdepasse) {
      newErrors.motdepasse = "Mot de passe requis";
    } else if (!checkPasswordStrength(formData.motdepasse)) {
      newErrors.motdepasse = "Le mot de passe doit comporter au moins 8 caractères incluant une majuscule, une minuscule, un chiffre et un caractère spécial.";
    }
    if (formData.motdepasse !== formData.confirmmotdepasse) {
      newErrors.confirmmotdepasse = "Les mots de passe ne correspondent pas.";
    }
    if (!formData.cle) newErrors.cle = "Clé requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await axios.post("http://localhost:8087/auth/signup", {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.motdepasse,
          confirm_password: formData.confirmmotdepasse,
          cle: formData.cle,
        });
        if (response.status === 200) {
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        setErrors({ email: "Une erreur est survenue. Veuillez réessayer." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6"></div>

              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Inscription</small>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Nom"
                      required
                    />
                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                  </div>

                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Prenom
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Prenom"
                      required
                    />
                    {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                  </div>

                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="E-mail"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      name="motdepasse"
                      value={formData.motdepasse}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Mot de passe"
                      required
                    />
                    {errors.motdepasse && <p className="text-red-500 text-xs mt-1">{errors.motdepasse}</p>}
                    {passwordStrength && (
                      <p className={`text-xs mt-1 ${
                        passwordStrength === "Fort" ? "text-green-500" : "text-red-500"
                      }`}>
                        Force du mot de passe: {passwordStrength}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Confirmer mot de passe
                    </label>
                    <input
                      type="password"
                      name="confirmmotdepasse"
                      value={formData.confirmmotdepasse}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Confirmer mot de passe"
                      required
                    />
                    {errors.confirmmotdepasse && <p className="text-red-500 text-xs mt-1">{errors.confirmmotdepasse}</p>}
                  </div>

                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Cle
                    </label>
                    <input
                      type="password"
                      name="cle"
                      value={formData.cle}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Cle"
                      required
                    />
                    {errors.cle && <p className="text-red-500 text-xs mt-1">{errors.cle}</p>}
                  </div>

                  <div className="text-center mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
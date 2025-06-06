import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock} from "react-icons/fa";
import DOMPurify from "dompurify";
import { AuthContext } from "./AuthContext"; 

// Validation de l'email
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validation du mot de passe
const isValidMotdepasse = (password) => password.length >= 6;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    motdepasse: '',
  });

  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sanitisation
  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    const sanitizedEmail = sanitizeInput(formData.email);
    const motdepasse = formData.motdepasse;

    if (!sanitizedEmail) {
      newErrors.email = 'Email requis';
    } else if (!validateEmail(sanitizedEmail)) {
      newErrors.email = 'Email invalide';
    }

    if (!motdepasse) {
      newErrors.motdepasse = 'Mot de passe requis';
    } else if (!isValidMotdepasse(motdepasse)) {
      newErrors.motdepasse = 'Le mot de passe doit contenir au moins 6 caractères.';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      setErrorMessage('Veuillez remplir tous les champs correctement.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login(sanitizeInput(formData.email), formData.motdepasse);
      const { accessToken, refreshToken, isActive, roles, user } = response;

      if (isActive) {
        setSuccessMessage('Connexion réussie !');

        const userData = { email: user.email, roles };
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem('accessToken', accessToken);
        storage.setItem('refreshToken', refreshToken);
        storage.setItem('roles', JSON.stringify(roles));
        storage.setItem('user', JSON.stringify(userData));

        // Redirect based on user role
        const targetRoute = roles.includes('ROLE_ADMIN')
          ? '/admin/dashboard'
          : roles.includes('ROLE_ENSEIGNANT')
          ? '/enseignant'
          : roles.includes('ROLE_APPRENANT')
          ? '/apprenant'
          : '/';
        setTimeout(() => navigate(targetRoute), 1000);
      } else {
        setErrorMessage("Compte non approuvé. Veuillez contacter l'administration.");
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setErrorMessage(error?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <h6 className="text-blueGray-500 text-sm font-bold">
                Connectez-vous avec vos identifiants
              </h6>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div className="text-blueGray-400 text-center mb-3 font-bold">
                <small>Entrez votre email et votre mot de passe</small>
              </div>
              
              <form onSubmit={handleSubmit}>

                <div className="input-box mb-3 relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                             <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              
                              required
                              placeholder="E-mail"
                              className="w-full p-2 pl-10 border rounded"
                           />
                              {error.email && (
                                 <p className="error-text text-red-500 text-xs mt-1">{error.email}</p>
                              )}
                 </div>
                
                <div className="input-box mb-3 relative">
                             <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="motdepasse"
                                value={formData.motdepasse}
                                onChange={handleChange}
                                required
                                placeholder="Mot de passe"
                                className="w-full p-2 pl-10 pr-10 border rounded"
                              />
                              
                               <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                                >
  
                               </span>
                               {error.motdepasse && (
                               <p className="error-text text-red-500 text-xs mt-1">{error.motdepasse}</p>
                               )}
                               </div>

                 

                <div className="se-souvenir flex justify-between items-center mb-3 text-sm">
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />{" "}
                    Se souvenir de moi
                  </label>
                  <Link to="/mot-de-passe-oublie" className="text-blue-500">
                    Mot de passe oublié ?
                  </Link>
                </div>

                 <div className="text-center mt-6">

                <button
                  type="submit"
                  disabled={isSubmitting}
                    className={`bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                >
                  {isSubmitting ? "Connexion en cours..." : "Se Connecter"}
                </button>

                {successMessage && (
                  <p className="success-text text-green-500 mt-2">{successMessage}</p>
                )}
                {errorMessage && (
                  <p className="error-text text-red-500 mt-2">{errorMessage}</p>
                )}

                <div className="lien-inscription text-center mt-4 text-sm">
                  <p>
                    Vous n'avez pas de compte ?{" "}
                    <Link to="/auth/register" className="text-blue-500">Inscription</Link>
                  </p>
                  </div>
                </div>

                   
               
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

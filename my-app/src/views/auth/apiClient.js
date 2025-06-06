import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8087",
});

// Fonction pour configurer l'intercepteur avec une fonction de navigation
export const configureApiClient = (navigate) => {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        // eslint-disable-next-line no-undef
        if (refreshToken && !isTokenExpired(refreshToken)) {
          // Appeler une API pour renouveler le token
          apiClient
            .post("/refresh", { refreshToken })
            .then((response) => {
              localStorage.setItem("accessToken", response.data.accessToken);
              // Réessayer la requête initiale
            })
            .catch(() => {
              navigate("/login");
            });
        } else {
          navigate("/login");
        }
      }
    }
  );
};

export default apiClient;

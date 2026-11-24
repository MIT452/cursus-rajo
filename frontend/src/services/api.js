import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cursus_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si le compte est suspendu pendant la session, on ferme la session et on revient à la connexion.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "";
    if (error.response?.status === 403 && /suspendu/i.test(message) && localStorage.getItem("cursus_token")) {
      localStorage.removeItem("cursus_token");
      window.location.href = "/connexion";
    }
    return Promise.reject(error);
  }
);

export default api;

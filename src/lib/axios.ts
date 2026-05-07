import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://edumanager.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globales (ex: 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/auth/login");
    const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

    if (error.response?.status === 401 && !isAuthRequest) {
      // On ne redirige que si ce n'est pas une tentative de connexion
      useAuthStore.getState().logout();
      if (typeof window !== "undefined" && !isLoginPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


export default api;

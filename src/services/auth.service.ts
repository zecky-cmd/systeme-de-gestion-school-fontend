import api from "@/lib/axios";
import { 
  LoginDto, 
  RegisterDto, 
  LoginResponse, 
  RegisterResponse 
} from "@/features/auth/types";

export const AuthService = {
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);
    const result = response.data;
    
    // Extraire le token peu importe le nom de la clé (accessToken, access_token, token)
    const token = result.accessToken || result.access_token || result.token;
    
    // Si l'utilisateur n'est pas dans la réponse, on le récupère via /auth/me
    let user = result.user;
    if (token && !user) {
      // Temporairement ajouter le token à axios pour cet appel si non encore stocké
      const meResponse = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      user = meResponse.data;
    }

    return {
      accessToken: token,
      user
    };
  },


  register: async (data: RegisterDto): Promise<RegisterResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  forgotPassword: async (email: string) => {
    return await api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (data: any) => {
    return await api.post("/auth/reset-password", data);
  }
};

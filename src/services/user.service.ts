import api from "@/lib/axios";
import { User } from "@/features/auth/types";

export const UserService = {
  /**
   * Récupérer tous les utilisateurs (optionnel : filtrer par rôle)
   */
  getAll: async (role?: string): Promise<User[]> => {
    const response = await api.get("/users", { params: { role } });
    return response.data;
  },

  /**
   * Récupérer un utilisateur par son ID
   */
  getOne: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Mettre à jour un utilisateur (Nom, Prénom, Email, etc.)
   * Utilise PUT /api/users/:id selon la documentation Swagger
   */
  update: async (id: number, data: Partial<User>): Promise<User> => {
    // Note: Le backend utilise PUT pour la mise à jour complète ou partielle dans ce cas
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer un utilisateur (Admin uniquement)
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
};

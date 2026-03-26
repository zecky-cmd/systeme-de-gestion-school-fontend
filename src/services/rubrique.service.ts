import api from "@/lib/axios";

export interface Rubrique {
  id: number;
  nom: string;
  description?: string;
  montantParDefaut?: number;
  estObligatoire: boolean;
  anneeId: number;
}

export const RubriqueService = {
  /**
   * Récupérer toutes les rubriques financières
   */
  getAll: async (anneeId?: number): Promise<Rubrique[]> => {
    const response = await api.get("/rubrique-financiere", { params: { anneeId } });
    return response.data;
  },

  /**
   * Récupérer une rubrique par son ID
   */
  getOne: async (id: number): Promise<Rubrique> => {
    const response = await api.get(`/rubrique-financiere/${id}`);
    return response.data;
  },

  /**
   * Créer une nouvelle rubrique (Admin)
   */
  create: async (data: any): Promise<Rubrique> => {
    const response = await api.post("/rubrique-financiere", data);
    return response.data;
  },

  /**
   * Mettre à jour une rubrique
   */
  update: async (id: number, data: any): Promise<Rubrique> => {
    const response = await api.patch(`/rubrique-financiere/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer une rubrique
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/rubrique-financiere/${id}`);
  }
};

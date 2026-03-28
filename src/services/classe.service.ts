import api from "@/lib/axios";

export type Cycle = "col" | "lyc";

export interface Classe {
  id: number;
  anneeId: number;
  nom: string;
  cycle: Cycle;
  niveau: string;
  serie?: string;
  salle?: string;
  capaciteMax?: number;
  
  // Champs calculés ou enrichis par le backend (optionnels selon l'endpoint)
  totalInscrits?: number;
  effectifG?: number;
  effectifF?: number;
  enseignantPrincipal?: {
    id: number;
    nom: string;
    prenom: string;
  };
  statut?: "actif" | "inactif" | "surcharge";
}

export const ClasseService = {
  /**
   * Récupérer toutes les classes
   * @param anneeId Optionnel - Filtrer par année scolaire
   */
  getAll: async (anneeId?: number): Promise<Classe[]> => {
    const response = await api.get("/classe", { params: { anneeId } });
    return response.data;
  },

  /**
   * Récupérer une classe par son ID
   */
  getOne: async (id: number): Promise<Classe> => {
    const response = await api.get(`/classe/${id}`);
    return response.data;
  },

  /**
   * Créer une nouvelle classe
   */
  create: async (data: Partial<Classe>): Promise<Classe> => {
    const response = await api.post("/classe", data);
    return response.data;
  },

  /**
   * Mettre à jour une classe
   */
  update: async (id: number, data: Partial<Classe>): Promise<Classe> => {
    const response = await api.patch(`/classe/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer une classe
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/classe/${id}`);
  }
};

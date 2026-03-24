import api from "@/lib/axios";

export interface Inscription {
  id: number;
  anneeId: number;
  eleveId: number;
  classeId: number;
  statut: string;
}

export const InscriptionService = {
  create: async (data: any): Promise<Inscription> => {
    const response = await api.post("/inscription", data);
    return response.data;
  },

  getAll: async (params?: any): Promise<Inscription[]> => {
    const response = await api.get("/inscription", { params });
    return response.data;
  }
};

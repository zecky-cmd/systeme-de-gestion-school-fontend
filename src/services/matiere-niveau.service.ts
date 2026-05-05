import api from "@/lib/axios";

export interface MatiereNiveau {
  id: number;
  classeId: number;
  matiereId: number;
  enseignantId?: number;
  coefficient: number;
  noteMax: number;
}

export const MatiereNiveauService = {
  getAll: async (): Promise<MatiereNiveau[]> => {
    const response = await api.get("/matiere-niveau");
    return response.data;
  },

  create: async (data: Partial<MatiereNiveau>): Promise<MatiereNiveau> => {
    const response = await api.post("/matiere-niveau", data);
    return response.data;
  },

  update: async (id: number, data: Partial<MatiereNiveau>): Promise<MatiereNiveau> => {
    const response = await api.patch(`/matiere-niveau/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/matiere-niveau/${id}`);
  }
};

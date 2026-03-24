import api from "@/lib/axios";

export interface Classe {
  id: number;
  nom: string;
  code?: string;
}

export const ClasseService = {
  getAll: async (): Promise<Classe[]> => {
    const response = await api.get("/classe");
    return response.data;
  },

  getOne: async (id: number): Promise<Classe> => {
    const response = await api.get(`/classe/${id}`);
    return response.data;
  }
};

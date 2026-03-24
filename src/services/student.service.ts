import api from "@/lib/axios";

export interface Eleve {
  id: number;
  matricule: string;
  nom?: string;
  prenom?: string;
  sexe: "M" | "F";
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  photoUrl?: string;
  classe?: {
    id: number;
    nom: string;
  };
}

export const StudentService = {
  getAll: async (): Promise<Eleve[]> => {
    const response = await api.get("/eleve");
    return response.data;
  },

  getOne: async (id: number): Promise<Eleve> => {
    const response = await api.get(`/eleve/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<Eleve> => {
    const response = await api.post("/eleve", data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<Eleve> => {
    const response = await api.patch(`/eleve/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/eleve/${id}`);
  }
};

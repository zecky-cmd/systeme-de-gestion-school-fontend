"use client";

import api from "@/lib/axios";

export interface Matiere {
  id: number;
  nom: string;
  code: string;
  cycle: "col" | "lyc" | "tous";
  couleur?: string;
}

export const MatiereService = {
  getAll: async (): Promise<Matiere[]> => {
    const response = await api.get("/matiere");
    return response.data;
  },

  getOne: async (id: number): Promise<Matiere> => {
    const response = await api.get(`/matiere/${id}`);
    return response.data;
  }
};

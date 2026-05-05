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
  },

  create: async (data: Partial<Matiere>): Promise<Matiere> => {
    const response = await api.post("/matiere", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Matiere>): Promise<Matiere> => {
    const response = await api.patch(`/matiere/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/matiere/${id}`);
  }
};

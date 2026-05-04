"use client";

import api from "@/lib/axios";
import { Matiere } from "./matiere.service";
import { Enseignant } from "./enseignant.service";

export interface AffectationMatiere {
  id: number;
  classeId: number;
  matiereId: number;
  enseignantId: number;
  coefficient: number;
  noteMax: number;
  
  // Données enrichies
  matiere?: Matiere;
  enseignant?: Enseignant;
}

export const AffectationService = {
  /**
   * Récupérer toutes les affectations (Matière-Niveau)
   * @param classeId Optionnel - Filtrer par classe
   */
  getAll: async (classeId?: number): Promise<AffectationMatiere[]> => {
    const response = await api.get("/matiere-niveau", { params: { classeId } });
    return response.data;
  },

  getOne: async (id: number): Promise<AffectationMatiere> => {
    const response = await api.get(`/matiere-niveau/${id}`);
    return response.data;
  }
};

"use client";

import api from "@/lib/axios";
import { AffectationMatiere } from "./affectation.service";

export type DayOfWeek = "lun" | "mar" | "mer" | "jeu" | "ven" | "sam";

export interface ScheduleSlot {
  id: number;
  matiereNiveauId: number;
  jour: DayOfWeek;
  heureDebut: string; // format ISO ou string "2023-01-01T08:00:00.000Z"
  heureFin: string;
  salle: string;
  
  // Données enrichies par le backend
  matiereNiveau?: AffectationMatiere;
}

export interface CreateScheduleSlotDto {
  matiereNiveauId: number;
  jour: DayOfWeek;
  heureDebut: string;
  heureFin: string;
  salle: string;
}

export const ScheduleService = {
  /**
   * Récupérer les créneaux (emploi du temps)
   * @param classeId Optionnel - Filtrer par classe
   */
  getAll: async (classeId?: number): Promise<ScheduleSlot[]> => {
    const response = await api.get("/creneau", { params: { classeId } });
    return response.data;
  },

  /**
   * Créer un nouveau créneau
   */
  create: async (data: CreateScheduleSlotDto): Promise<ScheduleSlot> => {
    const response = await api.post("/creneau", data);
    return response.data;
  },

  /**
   * Supprimer un créneau
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/creneau/${id}`);
  }
};

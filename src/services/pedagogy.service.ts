import api from "@/lib/axios";

export interface SubjectCoefficient {
  id: number;
  matiere: string;
  code: string;
  groupe: "Sciences" | "Lettres" | "Langues" | "Sport" | "Arts";
  coefficients: Record<string, number>; // ex: { "6e": 4, "5e": 4, ... }
}

export interface NoteType {
  id: string;
  label: string;
  weight: number;
  color: string;
}

export const PedagogyService = {
  getSubjects: async (): Promise<SubjectCoefficient[]> => {
    const response = await api.get("/pedagogy/subjects");
    return response.data;
  },

  getNoteTypes: async (): Promise<NoteType[]> => {
    const response = await api.get("/pedagogy/note-types");
    return response.data;
  },

  updateCoefficient: async (subjectId: number, level: string, value: number): Promise<void> => {
    await api.patch(`/pedagogy/subjects/${subjectId}/coefficients`, { level, value });
  }
};

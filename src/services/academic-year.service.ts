import api from "@/lib/axios";

export interface AcademicYear {
  id: number;
  libelle: string; // ex: "2025-2026"
  dateDebut: string;
  dateFin: string;
  isActive: boolean;
  modeEval: "trim" | "sem";
}

export interface EvaluationPeriod {
  id: number;
  libelle: string;
  dateDebut: string;
  dateFin: string;
  statut: "ouv" | "clos" | "arch";
}

export interface SchoolSeries {
  id: string;
  label: string;
  isActive: boolean;
}

export const AcademicYearService = {
  getYears: async (): Promise<AcademicYear[]> => {
    const response = await api.get("/annee-scolaire");
    return response.data;
  },

  getPeriods: async (yearId: number): Promise<EvaluationPeriod[]> => {
    const response = await api.get("/periode", { params: { anneeId: yearId } });
    return response.data;
  },

  getSeries: async (): Promise<SchoolSeries[]> => {
    const response = await api.get("/school-series");
    return response.data;
  },

  toggleSeries: async (seriesId: string, isActive: boolean): Promise<void> => {
    await api.patch(`/school-series/${seriesId}`, { isActive });
  },

  updateAllSeries: async (series: SchoolSeries[]): Promise<void> => {
    await api.put("/school-series", series);
  }
};

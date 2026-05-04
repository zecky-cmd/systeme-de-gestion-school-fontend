import api from "@/lib/axios";

export interface AcademicYear {
  id: number;
  label: string; // ex: "2025-2026"
  startDate: string;
  endDate: string;
  isActive: boolean;
  typePériode: "Trimestrielle" | "Semestrielle";
}

export interface EvaluationPeriod {
  id: number;
  label: string;
  startDate: string;
  endDate: string;
  status: "Cloturee" | "Ouverte" | "A venir";
}

export interface SchoolSeries {
  id: string;
  label: string;
  isActive: boolean;
}

export const AcademicYearService = {
  getYears: async (): Promise<AcademicYear[]> => {
    const response = await api.get("/academic-years");
    return response.data;
  },

  getPeriods: async (yearId: number): Promise<EvaluationPeriod[]> => {
    const response = await api.get(`/academic-years/${yearId}/periods`);
    return response.data;
  },

  getSeries: async (): Promise<SchoolSeries[]> => {
    const response = await api.get("/school-series");
    return response.data;
  },

  toggleSeries: async (seriesId: string, isActive: boolean): Promise<void> => {
    await api.patch(`/school-series/${seriesId}`, { isActive });
  }
};

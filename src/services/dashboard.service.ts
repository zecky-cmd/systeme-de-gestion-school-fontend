import api from "@/lib/axios";

export interface DashboardStats {
  totalEleves: number;
  totalEnseignants: number;
  totalClasses: number;
  totalParents: number;
  tauxPaiement: number;
  absencesAujourdhui: number;
  inscriptionsRecentes: {
    id: number;
    nom: string;
    prenom: string;
    matricule: string;
    date: string;
    classe?: {
      id: number;
      nom: string;
    };
  }[];
}

export const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  }
};

import api from "@/lib/axios";

export interface DashboardStats {
  totalEleves: number;
  totalEnseignants: number;
  totalClasses: number;
  totalParents: number;
  tauxPaiement: number;
  absencesAujourdhui: number;
  inscriptionsRecentes: any[];
}

export const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  }
};

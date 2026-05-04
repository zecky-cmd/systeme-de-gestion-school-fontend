import api from "@/lib/axios";

export interface FeeRubric {
  id: number;
  label: string;
  isMandatory: boolean;
  prices: Record<string, number>; // ex: { "6e": 50000, "5e": 50000, ... }
}

export const FinanceService = {
  getFees: async (): Promise<FeeRubric[]> => {
    const response = await api.get("/finance/fees");
    return response.data;
  },

  updateFee: async (rubricId: number, level: string, price: number): Promise<void> => {
    await api.patch(`/finance/fees/${rubricId}`, { level, price });
  }
};

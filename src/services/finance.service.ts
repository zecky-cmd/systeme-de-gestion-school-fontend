import api from "@/lib/axios";

export interface Tarif {
  id?: number;
  niveau: string; // ex: "6e", "5e", ...
  categorieId: number;
  montant: number;
}

export interface RubriqueFinanciere {
  id: number;
  libelle: string;
  cycle: "col" | "lyc" | "tous";
  estObligatoire: boolean;
  ordre: number;
  anneeId: number;
  tarifs: Tarif[];
}

export interface CategorieTarifaire {
  id: number;
  nom: string;
  description?: string;
}

export interface CreateRubriqueFinanciereDto {
  anneeId: number;
  libelle: string;
  cycle: "col" | "lyc" | "tous";
  estObligatoire: boolean;
  ordre: number;
  tarifs: {
    niveau: string;
    categorieId: number;
    montant: number;
  }[];
}

export interface CreateCategorieTarifaireDto {
  nom: string;
  description?: string;
}

export interface CopierTarifsDto {
  sourceCategorieId: number;
  destinationCategorieId: number;
  pourcentageReduction?: number;
}

export const FinanceService = {
  // Catégories Tarifaires
  getCategories: async (): Promise<CategorieTarifaire[]> => {
    const response = await api.get("/categorie-tarifaire");
    return response.data;
  },

  createCategory: async (data: CreateCategorieTarifaireDto): Promise<CategorieTarifaire> => {
    const response = await api.post("/categorie-tarifaire", data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<CreateCategorieTarifaireDto>): Promise<CategorieTarifaire> => {
    const response = await api.patch(`/categorie-tarifaire/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categorie-tarifaire/${id}`);
  },

  // Rubriques Financières
  getRubrics: async (anneeId?: number): Promise<RubriqueFinanciere[]> => {
    const params = anneeId ? { anneeId: String(anneeId) } : undefined;
    const response = await api.get("/rubrique-financiere", { params });
    return response.data;
  },

  getRubric: async (id: number): Promise<RubriqueFinanciere> => {
    const response = await api.get(`/rubrique-financiere/${id}`);
    return response.data;
  },

  createRubric: async (data: CreateRubriqueFinanciereDto): Promise<RubriqueFinanciere> => {
    const response = await api.post("/rubrique-financiere", data);
    return response.data;
  },

  updateRubric: async (id: number, data: any): Promise<RubriqueFinanciere> => {
    const response = await api.patch(`/rubrique-financiere/${id}`, data);
    return response.data;
  },

  deleteRubric: async (id: number): Promise<void> => {
    await api.delete(`/rubrique-financiere/${id}`);
  },

  // Global operations
  copyTariffs: async (data: CopierTarifsDto): Promise<void> => {
    await api.post("/finance/copier-tarifs", data);
  }
};

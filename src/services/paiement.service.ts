import api from "@/lib/axios";

export interface Paiement {
  id: number;
  eleveId: number;
  rubriqueId: number;
  anneeId: number;
  montant: number;
  datePaiement: string;
  modePaiement: "esp" | "vrt" | "chq" | "mob"; // Espèces, Virement, Chèque, Mobile Money
  reference?: string;
  commentaire?: string;
  rubrique?: {
    id: number;
    nom: string;
  };
}

export interface FinanceSituation {
  totalDu: number;
  totalPaye: number;
  resteAPayer: number;
  statut: "complet" | "partiel" | "impaye";
}

export const PaiementService = {
  /**
   * Enregistrer un nouveau versement
   */
  create: async (data: any): Promise<Paiement> => {
    const response = await api.post("/paiement", data);
    return response.data;
  },

  /**
   * Récupérer l'historique des paiements d'un élève
   */
  getHistory: async (eleveId: number): Promise<Paiement[]> => {
    const response = await api.get("/paiement", { params: { eleveId } });
    return response.data;
  },

  /**
   * Récupérer la situation financière d'un élève (Solde)
   * GET /api/paiement/situation/:eleveId
   */
  getSituation: async (eleveId: number, anneeId?: number): Promise<FinanceSituation> => {
    const response = await api.get(`/paiement/situation/${eleveId}`, { params: { anneeId } });
    return response.data;
  },

  /**
   * Supprimer un paiement (Admin uniquement)
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/paiement/${id}`);
  }
};

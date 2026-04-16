import api from "@/lib/axios";

export type ModePaiement = "esp" | "mobile" | "cheque";

export interface Paiement {
  id: number;
  eleveId: number;
  rubriqueId: number;
  encaisseParId: number;
  anneeId: number;
  montant: number;
  datePaiement: string;
  mode: ModePaiement;
  reference?: string;
  recuNum?: string;
  pdfUrl?: string;
  eleve?: {
    id: number;
    nom: string;
    prenom: string;
    matricule: string;
    classe?: {
      id: number;
      nom: string;
    };
  };
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
   * Enregistrer un nouveau versement (CreatePaiementDto compatible)
   */
  create: async (data: {
    eleveId: number;
    rubriqueId: number;
    encaisseParId: number;
    montant: number;
    mode: ModePaiement;
    reference?: string;
    recuNum?: string;
    pdfUrl?: string;
  }): Promise<Paiement> => {
    const response = await api.post("/paiement", data);
    return response.data;
  },

  /**
   * Récupérer l'historique des paiements (Filtres optionnels)
   */
  getAll: async (params?: { 
    eleveId?: number; 
    anneeId?: number;
    classeId?: number;
  }): Promise<Paiement[]> => {
    const response = await api.get("/paiement", { params });
    return response.data;
  },

  /**
   * Récupérer la situation financière d'un élève
   */
  getSituation: async (eleveId: number, anneeId?: number): Promise<FinanceSituation> => {
    const response = await api.get(`/paiement/situation/${eleveId}`, { params: { anneeId } });
    return response.data;
  },

  /**
   * Supprimer un paiement
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/paiement/${id}`);
  }
};

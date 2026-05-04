import api from "@/lib/axios";
import { User } from "@/features/auth/types";

export type TypeContrat = "permanent" | "vacataire";

export interface Enseignant {
  id: number;
  userId: number;
  matricule?: string;
  specialites?: string[];
  telephone?: string;
  statut: "actif" | "inact";
  typeContrat?: TypeContrat;
  user?: User;

  // Champs enrichis par le backend (analytique)
  matieres?: string[];
  classes?: {
    count: number;
    noms: string[];
  };
  heuresSemaine?: number;
  classesPrincipales?: string[];
}

export interface MatiereStats {
  matiereId: number;
  nomMatiere: string;
  nombreClasses: number;
  nombreEnseignants: number;
  totalHeuresSemaine: number;
  enseignants: {
    id: number;
    nom: string;
    prenom: string;
    initiales: string;
  }[];
}

export interface CreateEnseignantCombinedDto {
  // Infos User
  nom: string;
  prenom: string;
  email: string;
  password?: string;

  // Infos Enseignant
  matricule: string;
  specialites: string[];
  telephone: string;
  statut: "actif" | "inact";
  typeContrat: TypeContrat;
}

export const EnseignantService = {
  /**
   * Récupérer tous les enseignants (avec données enrichies)
   */
  getAll: async (): Promise<Enseignant[]> => {
    const response = await api.get("/enseignant");
    return response.data;
  },

  /**
   * Récupérer un enseignant par son ID
   */
  getOne: async (id: number): Promise<Enseignant> => {
    const response = await api.get(`/enseignant/${id}`);
    return response.data;
  },

  /**
   * Récupérer les statistiques par matière
   */
  getStatsByMatiere: async (): Promise<MatiereStats[]> => {
    const response = await api.get("/enseignant/stats/matieres");
    return response.data;
  },

  /**
   * Créer un enseignant (Processus combiné : User + Enseignant)
   */
  createCombined: async (data: CreateEnseignantCombinedDto): Promise<Enseignant> => {
    // 1. Créer le User
    const userResponse = await api.post("/auth/register", {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      password: data.password || "Enseignant@123",
      role: "ens"
    });

    const newUser = userResponse.data.user || userResponse.data;

    // 2. Créer l'Enseignant lié
    const enseignantResponse = await api.post("/enseignant", {
      userId: newUser.id,
      matricule: data.matricule,
      specialites: data.specialites,
      telephone: data.telephone,
      statut: data.statut,
      typeContrat: data.typeContrat
    });

    return enseignantResponse.data;
  },

  /**
   * Mettre à jour un enseignant (et son User associé)
   */
  update: async (id: number, userId: number, data: Partial<CreateEnseignantCombinedDto>): Promise<Enseignant> => {
    // Si des données User sont modifiées
    if (data.nom || data.prenom || data.email) {
      await api.put(`/users/${userId}`, {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email
      });
    }

    // Mettre à jour les infos Enseignant
    const response = await api.patch(`/enseignant/${id}`, {
      matricule: data.matricule,
      specialites: data.specialites,
      telephone: data.telephone,
      statut: data.statut,
      typeContrat: data.typeContrat
    });

    return response.data;
  },

  /**
   * Supprimer un enseignant
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/enseignant/${id}`);
  }
};

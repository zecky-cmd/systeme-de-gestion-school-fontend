import api from "@/lib/axios";
import { User } from "@/features/auth/types";

export interface Enseignant {
  id: number;
  userId: number;
  matricule?: string;
  specialite?: string;
  telephone?: string;
  statut: "actif" | "inact";
  user?: User; // Inclut les infos de l'utilisateur (nom, prénom, email, etc.)
  _count?: {
    classesPrincipales: number;
    matieres: number;
  };
}

export interface CreateEnseignantCombinedDto {
  // Infos User
  nom: string;
  prenom: string;
  email: string;
  password?: string; // Optionnel si on génère un mot de passe par défaut

  // Infos Enseignant
  matricule: string;
  specialite: string;
  telephone: string;
  statut: "actif" | "inact";
}

export const EnseignantService = {
  /**
   * Récupérer tous les enseignants
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
   * Créer un enseignant (Processus combiné : User + Enseignant)
   */
  createCombined: async (data: CreateEnseignantCombinedDto): Promise<Enseignant> => {
    // 1. Créer le User
    const userResponse = await api.post("/auth/register", {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      password: data.password || "Enseignant@123", // Mot de passe par défaut sécurisé
      role: "ens"
    });

    const newUser = userResponse.data.user || userResponse.data; // Dépend de la réponse exacte de l'API

    // 2. Créer l'Enseignant lié
    const enseignantResponse = await api.post("/enseignant", {
      userId: newUser.id,
      matricule: data.matricule,
      specialite: data.specialite,
      telephone: data.telephone,
      statut: data.statut
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
      specialite: data.specialite,
      telephone: data.telephone,
      statut: data.statut
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

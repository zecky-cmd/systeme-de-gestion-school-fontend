import api from "@/lib/axios";

export interface ConfigUser {
  id: number;
  nom: string;
  prenom?: string;
  email: string;
  role: "adm" | "dir" | "ens" | "par" | "elv";
  estActif?: boolean;
  password?: string; // Ajouté pour la gestion de la création
  avatarUrl?: string;
  derniereConnexion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionRow {
  fonctionnalite: string;
  roles: Record<string, boolean>; 
}

export const UserManagementService = {
  getUsers: async (role?: string): Promise<ConfigUser[]> => {
    const response = await api.get("/users", { params: { role } });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
    return [];
  },

  createUser: async (data: Partial<ConfigUser & { password?: string }>): Promise<ConfigUser> => {
    const createData = {
      email: data.email,
      password: data.password || "Password123!", // Mot de passe par défaut si non fourni
      nom: data.nom,
      prenom: data.prenom,
      role: data.role,
      estActif: data.estActif ?? true
    };
    const response = await api.post("/users", createData);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<ConfigUser>): Promise<ConfigUser> => {
    // On ne garde que les champs strictement acceptés par le modèle Prisma du backend
    const updateData = {
      email: data.email,
      nom: data.nom,
      prenom: data.prenom,
      role: data.role,
      estActif: data.estActif
    };

    // On supprime les champs undefined pour éviter d'écraser des données par erreur
    Object.keys(updateData).forEach(key => 
      (updateData as any)[key] === undefined && delete (updateData as any)[key]
    );

    const response = await api.put(`/users/${id}`, updateData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getUserById: async (id: number): Promise<ConfigUser> => {
    const response = await api.get(`/users/${id}`);
    // Gère le cas où l'API renvoie { message: "...", data: { ... } } comme vu sur la capture
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  getPermissions: (): PermissionRow[] => {
    return [
      { fonctionnalite: "Gestion des utilisateurs", roles: { "adm": true, "dir": true, "ens": false, "par": false, "elv": false } },
      { fonctionnalite: "Configuration école", roles: { "adm": true, "dir": true, "ens": false, "par": false, "elv": false } },
      { fonctionnalite: "Saisie des notes (Ownership)", roles: { "adm": true, "dir": true, "ens": true, "par": false, "elv": false } },
      { fonctionnalite: "Consultation des notes (Soi/Enfant)", roles: { "adm": true, "dir": true, "ens": true, "par": true, "elv": true } },
      { fonctionnalite: "Gestion financière", roles: { "adm": true, "dir": true, "ens": false, "par": false, "elv": false } },
    ];
  }
};

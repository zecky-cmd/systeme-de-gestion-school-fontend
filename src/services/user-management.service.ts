import api from "@/lib/axios";

export interface ConfigUser {
  id: number;
  nom: string;
  email: string;
  role: string;
  statut: "Actif" | "Inactif";
  dernierAcces: string;
  avatarUrl?: string;
}

export interface PermissionRow {
  fonctionnalite: string;
  roles: Record<string, boolean>; // ex: { "Directeur": true, "Secretaire": true, ... }
}

export const UserManagementService = {
  getUsers: async (): Promise<ConfigUser[]> => {
    const response = await api.get("/config/users");
    return response.data;
  },

  getPermissions: async (): Promise<PermissionRow[]> => {
    const response = await api.get("/config/permissions");
    return response.data;
  },

  updatePermission: async (fonctionnalite: string, role: string, value: boolean): Promise<void> => {
    await api.patch("/config/permissions", { fonctionnalite, role, value });
  }
};

import api from "@/lib/axios";

export interface EtablissementConfig {
  anneeActiveId: number;
  nom: string;
  // ... autres champs
}

export const ConfigService = {
  getConfig: async (): Promise<EtablissementConfig> => {
    const response = await api.get("/etablissement-config");
    return response.data;
  }
};

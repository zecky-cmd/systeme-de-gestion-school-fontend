import api from "@/lib/axios";

export interface SchoolConfig {
  id: number;
  nomComplet: string;
  sigle: string;
  agrementMena: string;
  typeEtablissement: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  directeur: string;
  logoUrl?: string;
}

export const SchoolService = {
  getConfig: async (): Promise<SchoolConfig> => {
    const response = await api.get("/school-config");
    return response.data;
  },

  updateConfig: async (data: Partial<SchoolConfig>): Promise<SchoolConfig> => {
    const response = await api.patch("/school-config", data);
    return response.data;
  },

  uploadLogo: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await api.post("/school-config/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data.url;
  }
};

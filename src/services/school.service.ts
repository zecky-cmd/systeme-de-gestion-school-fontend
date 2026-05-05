import api from "@/lib/axios";

export interface SchoolConfig {
  id?: number;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  logoUrl?: string;
  devise?: string;
  anneeActiveId?: number;
}

export const SchoolService = {
  getConfig: async (): Promise<SchoolConfig> => {
    const response = await api.get("/etablissement-config");
    return response.data;
  },

  updateConfig: async (data: Partial<SchoolConfig>): Promise<SchoolConfig> => {
    const response = await api.post("/etablissement-config", data);
    return response.data;
  },

  uploadLogo: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/etablissement-config/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data.url;
  }
};

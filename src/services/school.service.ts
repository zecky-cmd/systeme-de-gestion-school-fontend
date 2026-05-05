import api from "@/lib/axios";
import { StorageService } from "./storage.service";

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
    // Filtrage strict pour ne pas envoyer de champs non autorisés par le DTO backend
    const allowedFields: (keyof SchoolConfig)[] = [
      "nom", "adresse", "telephone", "email", "logoUrl", "devise", "anneeActiveId"
    ];
    
    const payload = Object.keys(data)
      .filter((key) => allowedFields.includes(key as keyof SchoolConfig))
      .reduce((obj, key) => {
        obj[key as keyof SchoolConfig] = data[key as keyof SchoolConfig];
        return obj;
      }, {} as any);

    const response = await api.patch("/etablissement-config", payload);
    return response.data;
  },

  setActiveYear: async (yearId: number): Promise<void> => {
    await api.put(`/etablissement-config/annee-active/${yearId}`);
  },

  uploadLogo: async (file: File): Promise<string> => {
    // Utiliser Supabase via StorageService au lieu de l'API backend
    const publicUrl = await StorageService.uploadProfilePhoto(file);
    return publicUrl;
  }
};

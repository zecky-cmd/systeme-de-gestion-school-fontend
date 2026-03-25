import { supabase } from "@/lib/supabase";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const BUCKET_NAME = "profiles"; // Assurez-vous que ce bucket existe et est public

export class StorageService {
  /**
   * Upload une photo de profil vers Supabase Storage
   * @param file Le fichier image à uploader
   * @returns L'URL publique de l'image
   */
  static async uploadProfilePhoto(file: File): Promise<string> {
    // 1. Validations
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Le fichier est trop lourd (Max 2MB)");
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Format non supporté (Utilisez JPEG, PNG ou WebP)");
    }

    // 2. Générer un nom de fichier unique
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // 3. Upload vers le bucket
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erreur Supabase Storage:", error);
      throw new Error(`Erreur lors de l'envoi de l'image: ${error.message}`);
    }

    // 4. Récupérer l'URL publique
    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  }
}

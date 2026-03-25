import * as z from "zod";

export const studentSchema = z.object({
  // User info
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  password: z.string().min(8, "8 caractères minimum").optional().or(z.literal("")),
  
  // Student profile
  matricule: z.string().optional(),
  sexe: z.enum(["M", "F"]),
  dateNaissance: z.string().optional().or(z.literal("")),
  lieuNaissance: z.string().optional(),
  nationalite: z.string().optional(),
  
  // Registration
  classeId: z.string().optional().or(z.literal("")),
  
  // social/profile
  photoUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

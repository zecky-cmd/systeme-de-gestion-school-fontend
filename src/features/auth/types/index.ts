import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Backend DTOs & Responses
export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: "adm" | "dir" | "ens" | "par" | "elv";
  photoUrl?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  user?: User;
}


export interface RegisterDto {
  email: string;
  password?: string;
  nom?: string;
  prenom?: string;
  role?: "adm" | "dir" | "ens" | "par" | "elv";
}

export interface RegisterResponse {
  accessToken: string;
  user: User;
}

export const forgotPasswordSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
});

export const resetPasswordSchema = z.object({
  code: z.string().length(6, "Le code doit contenir exactement 6 chiffres"),
  newPassword: z.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;



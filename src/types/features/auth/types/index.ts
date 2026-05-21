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


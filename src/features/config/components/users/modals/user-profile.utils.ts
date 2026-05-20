import { 
  User as UserIcon, 
  Shield, 
  GraduationCap, 
  Users as UsersIcon, 
  Baby 
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface RoleInfo {
  label: string;
  icon: LucideIcon;
}
//  * Retourne le libellé et l'icône Lucide associés à un rôle d'utilisateur.
export const getRoleInfo = (role?: string): RoleInfo => {
  switch (role) {
    case "adm": return { label: "Administrateur", icon: Shield };
    case "dir": return { label: "Directeur", icon: UserIcon };
    case "ens": return { label: "Enseignant", icon: GraduationCap };
    case "par": return { label: "Parent", icon: Baby };
    case "elv": return { label: "Élève", icon: UsersIcon };
    default: return { label: role || "", icon: UserIcon };
  }
};
//  * Formate une chaîne de date ISO en français : "JJ mois AAAA à HH:MM".
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "Aucune connexion enregistrée";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Format invalide";
  
  const day = date.toLocaleDateString("fr-FR", { day: "numeric" });
  const month = date.toLocaleDateString("fr-FR", { month: "long" });
  const year = date.toLocaleDateString("fr-FR", { year: "numeric" });
  const time = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  
  return `${day} ${month} ${year} à ${time}`;
};

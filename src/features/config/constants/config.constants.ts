import { Building2, Calendar, BookOpen, Banknote, Users, ShieldCheck } from "lucide-react";

export type ConfigTab = "etablissement" | "annee" | "pedagogie" | "frais" | "utilisateurs" | "securite";

export const CONFIG_TABS = [
  { id: "etablissement", label: "Etablissement", icon: Building2 },
  { id: "annee", label: "Annee scolaire", icon: Calendar },
  { id: "pedagogie", label: "Pedagogie", icon: BookOpen },
  { id: "frais", label: "Frais scolaires", icon: Banknote },
  { id: "utilisateurs", label: "Utilisateurs", icon: Users },
  { id: "securite", label: "Securite", icon: ShieldCheck },
] as const;

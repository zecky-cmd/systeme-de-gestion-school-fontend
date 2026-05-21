import { BookOpen, Users } from "lucide-react";

export type EnseignantsTabView = "liste" | "matiere";

export const ENSEIGNANTS_TABS = [
  { id: "liste" as EnseignantsTabView, label: "Liste des enseignants", icon: Users },
  { id: "matiere" as EnseignantsTabView, label: "Par matière", icon: BookOpen },
] as const;

export const ENSEIGNANT_CONTRACT_FILTER_OPTIONS = [
  { value: "tous", label: "Tous" },
  { value: "permanent", label: "Permanent" },
  { value: "vacataire", label: "Vacataire" },
] as const;

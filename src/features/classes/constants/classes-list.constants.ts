import { LayoutGrid, Landmark, School } from "lucide-react";
import type { Cycle } from "@/services/classe.service";

export type ClassesCycleFilter = "all" | Cycle;

export const CLASSES_CYCLE_TABS = [
  { value: "all" as ClassesCycleFilter, label: "Toutes", icon: LayoutGrid },
  { value: "col" as ClassesCycleFilter, label: "Premier Cycle", icon: School },
  { value: "lyc" as ClassesCycleFilter, label: "2ème Cycle", icon: Landmark },
] as const;

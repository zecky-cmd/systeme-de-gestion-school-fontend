import { Monitor, Moon, Sun } from "lucide-react";
import type { UserRole } from "@/constants/permissions";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  adm: "Système",
  dir: "Direction",
  ens: "Enseignant",
  par: "Parent",
  elv: "Élève",
};

export const THEME_OPTIONS = [
  { id: "light", label: "Clair", icon: Sun },
  { id: "dark", label: "Sombre", icon: Moon },
  { id: "system", label: "Système", icon: Monitor },
] as const;

export type ThemeOptionId = (typeof THEME_OPTIONS)[number]["id"];

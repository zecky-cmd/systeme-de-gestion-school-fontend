import { DayOfWeek } from "@/services/schedule.service";

export const DAYS_MAP: Record<string, string> = {
  "lun": "Lundi",
  "mar": "Mardi",
  "mer": "Mercredi",
  "jeu": "Jeudi",
  "ven": "Vendredi",
  "sam": "Samedi"
};

export const REV_DAYS_MAP: Record<string, DayOfWeek> = {
  "Lundi": "lun",
  "Mardi": "mar",
  "Mercredi": "mer",
  "Jeudi": "jeu",
  "Vendredi": "ven",
  "Samedi": "sam"
};

export const GRID_HOURS = [
  "07h30 - 08h30", "08h30 - 09h30", "09h30 - 10h30", 
  "PAUSE", 
  "11h00 - 12h00", "12h00 - 13h00", 
  "14h00 - 15h00", "15h00 - 16h00", "16h00 - 17h00"
];

export const COLORS_PALETTE = [
  "bg-emerald-50 border-emerald-500/20 text-emerald-700",
  "bg-blue-50 border-blue-500/20 text-blue-700",
  "bg-orange-50 border-orange-500/20 text-orange-700",
  "bg-rose-50 border-rose-500/20 text-rose-700",
  "bg-amber-50 border-amber-500/20 text-amber-700",
  "bg-teal-50 border-teal-500/20 text-teal-700",
];

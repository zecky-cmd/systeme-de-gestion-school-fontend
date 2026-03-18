export const STATUS_COLORS: Record<string, { bg: string; text: string; outline?: boolean }> = {
  // Statuts d'inscription généraux
  "Inscrit": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Pre-inscrit": { bg: "bg-slate-100", text: "text-slate-600", outline: true },
  "Transfert": { bg: "bg-slate-100", text: "text-slate-600", outline: true },
  
  // Statuts des classes
  "Actif": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Surcharge": { bg: "bg-red-500", text: "text-white" },
  
  // Statuts de paiement (texte seul ou léger background)
  "Complet": { bg: "bg-emerald-50", text: "text-emerald-600" },
  "Partiel": { bg: "bg-amber-50", text: "text-amber-600" },
  "En retard": { bg: "bg-red-50", text: "text-red-600" },
  "Non paye": { bg: "bg-red-50", text: "text-red-600" },
  
  // Défaut au cas où
  "default": { bg: "bg-slate-100", text: "text-slate-700" }
};

export const CYCLE_BADGE: Record<string, { bg: string; text: string }> = {
  "College": { bg: "bg-slate-100", text: "text-slate-600" },
  "Lycee": { bg: "bg-emerald-700", text: "text-white" },
};

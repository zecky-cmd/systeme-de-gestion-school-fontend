import type { Enseignant } from "@/services/enseignant.service";

export function getEnseignantSearchString(enseignant: Enseignant): string {
  return `${enseignant.user?.nom ?? ""} ${enseignant.user?.prenom ?? ""} ${enseignant.matricule ?? ""} ${enseignant.matieres?.join(" ") ?? ""}`.toLowerCase();
}

export interface EnseignantListStats {
  total: number;
  vacataires: number;
  permanents: number;
  matieresCouvertes: number;
}

export function computeEnseignantStats(
  enseignants: Enseignant[]
): EnseignantListStats {
  const vacataires = enseignants.filter(
    (e) => e.typeContrat === "vacataire"
  ).length;
  const permanents = enseignants.filter(
    (e) => e.typeContrat === "permanent"
  ).length;
  const matiereSet = new Set(
    enseignants.flatMap((e) => e.matieres ?? []).filter(Boolean)
  );

  return {
    total: enseignants.length,
    vacataires,
    permanents,
    matieresCouvertes: matiereSet.size,
  };
}

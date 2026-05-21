import type { Eleve } from "@/services/student.service";

export function getStudentIdentity(eleve: Eleve) {
  const nom = eleve.nom ?? eleve.user?.nom ?? "Non renseigné";
  const prenom = eleve.prenom ?? eleve.user?.prenom ?? "";
  const initials =
    nom.substring(0, 1).toUpperCase() +
    (prenom.substring(0, 1).toUpperCase() || "");
  const photoUrl = eleve.photoUrl ?? eleve.user?.photoUrl;

  return {
    nom,
    prenom,
    fullName: `${nom} ${prenom}`.trim(),
    initials,
    photoUrl,
  };
}

export function getStudentClasseName(eleve: Eleve): string {
  return eleve.classe?.nom ?? eleve.currentClasse ?? "N/A";
}

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

export function getStudentClasseName(eleve: any): string {
  const { classe, classeNom, currentClasse, inscriptions, classeId } = eleve;

  if (classe?.nom) return classe.nom;
  if (typeof classe === "string") return classe;
  if (classeNom) return classeNom;
  if (currentClasse) return currentClasse;
  
  if (inscriptions && Array.isArray(inscriptions) && inscriptions.length > 0) {
    const activeInscription = inscriptions[0];
    if (activeInscription.classe?.nom) return activeInscription.classe.nom;
    if (activeInscription.classeId) return `Classe #${activeInscription.classeId}`;
  }

  // Fallback to classeId if present
  if (classeId) return `Classe #${classeId}`;

  return "N/A";
}


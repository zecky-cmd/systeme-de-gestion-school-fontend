import type { Eleve } from "@/services/student.service";
import { getStudentIdentity } from "./student-display.utils";

export interface StudentFilterCriteria {
  searchTerm: string;
  selectedClasse: string;
  selectedStatus: string;
}

export function filterStudents(
  eleves: Eleve[],
  { searchTerm, selectedClasse, selectedStatus }: StudentFilterCriteria
): Eleve[] {
  const searchLower = searchTerm.toLowerCase();

  return eleves.filter((eleve) => {
    // 1. Recherche par terme (Nom, Prénom, Matricule)
    const { nom, prenom } = getStudentIdentity(eleve);
    const matricule = (eleve.matricule ?? "").toLowerCase();

    const matchesSearch =
      !searchTerm ||
      nom.toLowerCase().includes(searchLower) ||
      prenom.toLowerCase().includes(searchLower) ||
      matricule.includes(searchLower);

    // 2. Filtre par classe
    const matchesClasse = !selectedClasse || selectedClasse === "tous" || selectedClasse === "all" || (() => {
      // On compare l'ID sélectionné aux différents champs possibles retournés par l'API
      if (eleve.classe?.id?.toString() === selectedClasse) return true;
      if ((eleve as any).classeId?.toString() === selectedClasse) return true;
      
      // Cas de tableau d'inscriptions
      const inscriptions = (eleve as any).inscriptions;
      if (inscriptions && Array.isArray(inscriptions) && inscriptions.length > 0) {
        if (inscriptions[0].classeId?.toString() === selectedClasse) return true;
        if (inscriptions[0].classe?.id?.toString() === selectedClasse) return true;
      }

      if (eleve.currentClasse?.toString() === selectedClasse) return true;
      
      // Fallback: on teste si le texte correspond au nom de la classe, bien que ce soit rare
      const classeNameLower = (eleve.classe?.nom || (eleve as any).classeNom || eleve.currentClasse || "").toLowerCase();
      if (classeNameLower && classeNameLower.includes(selectedClasse.toLowerCase())) return true;

      return false;
    })();

    // 3. Filtre par statut (l'UI utilise 'Inscrit' par défaut si absent)
    const statut = (eleve.statut || "inscrit").toLowerCase();
    const matchesStatus =
      !selectedStatus ||
      selectedStatus === "tous" ||
      selectedStatus === "all" ||
      statut === selectedStatus.toLowerCase();

    return matchesSearch && matchesClasse && matchesStatus;
  });
}

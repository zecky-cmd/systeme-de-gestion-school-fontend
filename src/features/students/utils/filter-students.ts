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
    const { nom, prenom } = getStudentIdentity(eleve);
    const matricule = (eleve.matricule ?? "").toLowerCase();

    const matchesSearch =
      !searchTerm ||
      nom.toLowerCase().includes(searchLower) ||
      prenom.toLowerCase().includes(searchLower) ||
      matricule.includes(searchLower);

    const matchesClasse =
      !selectedClasse ||
      eleve.classe?.id?.toString() === selectedClasse ||
      eleve.classe?.nom?.toLowerCase().includes(selectedClasse.toLowerCase());

    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "tous"
        ? true
        : eleve.statut?.toLowerCase() === selectedStatus.toLowerCase());

    return matchesSearch && matchesClasse && matchesStatus;
  });
}

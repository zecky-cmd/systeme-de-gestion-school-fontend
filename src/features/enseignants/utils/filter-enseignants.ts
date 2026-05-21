import type { Enseignant } from "@/services/enseignant.service";
import { getEnseignantSearchString } from "./enseignant-display.utils";

export interface EnseignantFilterCriteria {
  search: string;
  filterType: string;
}

export function filterEnseignants(
  enseignants: Enseignant[],
  { search, filterType }: EnseignantFilterCriteria
): Enseignant[] {
  const searchLower = search.toLowerCase();

  return enseignants.filter((e) => {
    const matchesSearch = getEnseignantSearchString(e).includes(searchLower);
    const matchesType = filterType === "tous" || e.typeContrat === filterType;
    return matchesSearch && matchesType;
  });
}

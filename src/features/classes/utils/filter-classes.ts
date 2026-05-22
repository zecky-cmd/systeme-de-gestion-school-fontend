import type { Classe } from "@/services/classe.service";
import type { ClassesCycleFilter } from "@/features/classes/constants/classes-list.constants";

export interface ClasseFilterCriteria {
  search: string;
  cycleFilter: ClassesCycleFilter;
}

export function filterClasses(
  classes: Classe[],
  { search, cycleFilter }: ClasseFilterCriteria
): Classe[] {
  const searchLower = search.toLowerCase();

  return classes.filter((c) => {
    const matchSearch =
      c.nom.toLowerCase().includes(searchLower) ||
      c.niveau.toLowerCase().includes(searchLower);
    const matchCycle = cycleFilter === "all" || c.cycle === cycleFilter;
    return matchSearch && matchCycle;
  });
}

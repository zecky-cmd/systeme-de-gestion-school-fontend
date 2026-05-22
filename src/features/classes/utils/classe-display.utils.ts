import type { Classe } from "@/services/classe.service";

export interface ClasseListStats {
  totalClasses: number;
  totalEleves: number;
  moyenneParClasse: number;
  classesSurcharge: number;
}

export function computeClasseStats(classes: Classe[]): ClasseListStats {
  const totalClasses = classes.length;
  const totalEleves = classes.reduce(
    (acc, curr) => acc + (curr.totalInscrits || 0),
    0
  );
  const moyenneParClasse =
    totalClasses > 0 ? totalEleves / totalClasses : 0;
  const classesSurcharge = classes.filter(
    (c) => (c.totalInscrits || 0) > (c.capaciteMax || 40)
  ).length;

  return { totalClasses, totalEleves, moyenneParClasse, classesSurcharge };
}

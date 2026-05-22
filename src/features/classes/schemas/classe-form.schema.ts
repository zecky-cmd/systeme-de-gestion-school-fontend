import * as z from "zod";
import type { Classe } from "@/services/classe.service";

export const classeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(30),
  cycle: z.enum(["col", "lyc"]),
  niveau: z.string().min(1, "Le niveau est requis").max(15),
  serie: z.string().max(5).optional(),
  salle: z.string().max(20).optional(),
  capaciteMax: z.number().min(1),
});

export type ClasseFormValues = z.infer<typeof classeSchema>;

export const DEFAULT_CLASSE_FORM_VALUES: ClasseFormValues = {
  nom: "",
  cycle: "col",
  niveau: "",
  serie: "",
  salle: "",
  capaciteMax: 40,
};

export function mapClasseToFormValues(
  classe?: Classe | null
): ClasseFormValues {
  if (!classe) {
    return DEFAULT_CLASSE_FORM_VALUES;
  }

  return {
    nom: classe.nom,
    cycle: classe.cycle,
    niveau: classe.niveau,
    serie: classe.serie ?? "",
    salle: classe.salle ?? "",
    capaciteMax: classe.capaciteMax ?? 40,
  };
}

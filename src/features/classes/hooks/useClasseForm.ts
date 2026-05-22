"use client";

import type { Classe } from "@/services/classe.service";
import { useClasseFormState } from "./useClasseFormState";
import { useClasseMutations } from "./useClasseMutations";

export type { ClasseFormValues } from "@/features/classes/schemas/classe-form.schema";
export {
  classeSchema,
  DEFAULT_CLASSE_FORM_VALUES,
  mapClasseToFormValues,
} from "@/features/classes/schemas/classe-form.schema";

interface UseClasseFormProps {
  mode: "add" | "edit" | "view";
  initialData?: Classe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Orchestration : état du formulaire (RHF + Zod) + mutations API (TanStack Query). */
export function useClasseForm(props: UseClasseFormProps) {
  const { form } = useClasseFormState({
    open: props.open,
    initialData: props.initialData,
  });

  const { upsertMutation, deleteMutation, submit } = useClasseMutations(props);

  return {
    form,
    onSubmit: submit,
    deleteMutation,
    upsertMutation,
  };
}

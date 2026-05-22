"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Classe } from "@/services/classe.service";
import {
  classeSchema,
  DEFAULT_CLASSE_FORM_VALUES,
  mapClasseToFormValues,
  type ClasseFormValues,
} from "@/features/classes/schemas/classe-form.schema";

interface UseClasseFormStateProps {
  open: boolean;
  initialData?: Classe | null;
}

export function useClasseFormState({ open, initialData }: UseClasseFormStateProps) {
  const form = useForm<ClasseFormValues>({
    resolver: zodResolver(classeSchema),
    defaultValues: DEFAULT_CLASSE_FORM_VALUES,
  });

  useEffect(() => {
    if (open) {
      form.reset(mapClasseToFormValues(initialData));
    }
  }, [open, initialData, form]);

  return { form };
}

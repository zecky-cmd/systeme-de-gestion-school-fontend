"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Classe, ClasseService } from "@/services/classe.service";
import { ConfigService } from "@/services/config.service";
import { toast } from "sonner";
import { useEffect } from "react";

/**
 * Schéma de validation Zod
 */
export const classeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(30),
  cycle: z.enum(["col", "lyc"]),
  niveau: z.string().min(1, "Le niveau est requis").max(15),
  serie: z.string().max(5).optional(),
  salle: z.string().max(20).optional(),
  capaciteMax: z.number().min(1).default(40),
});

export type ClasseFormValues = z.infer<typeof classeSchema>;

interface UseClasseFormProps {
  mode: "add" | "edit" | "view";
  initialData?: Classe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function useClasseForm({ mode, initialData, open, onOpenChange }: UseClasseFormProps) {
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";

  // Récupérer la config pour avoir l'anneeId active (pour l'ajout)
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: () => ConfigService.getConfig(),
    enabled: open && mode === "add",
  });

  const form = useForm<ClasseFormValues>({
    resolver: zodResolver(classeSchema) as any,
    defaultValues: {
      nom: "",
      cycle: "col",
      niveau: "",
      serie: "",
      salle: "",
      capaciteMax: 40,
    },
  });

  // Réinitialiser le formulaire quand les données initiales changent
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          nom: initialData.nom,
          cycle: initialData.cycle,
          niveau: initialData.niveau,
          serie: initialData.serie || "",
          salle: initialData.salle || "",
          capaciteMax: initialData.capaciteMax || 40,
        });
      } else {
        form.reset({
          nom: "",
          cycle: "col",
          niveau: "",
          serie: "",
          salle: "",
          capaciteMax: 40,
        });
      }
    }
  }, [open, initialData, form]);

  // Mutation pour Création / Mise à jour
  const upsertMutation = useMutation({
    mutationFn: (data: ClasseFormValues) => {
      if (isEdit && initialData) {
        return ClasseService.update(initialData.id, data);
      } else {
        if (!config?.anneeActiveId) throw new Error("Année scolaire non définie");
        return ClasseService.create({
          ...data,
          anneeId: config.anneeActiveId,
        });
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? "Classe mise à jour !" : "Classe créée avec succès !");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error("Échec de l'opération: " + (error.response?.data?.message || error.message));
    },
  });

  // Mutation pour Suppression
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!initialData) throw new Error("Aucune classe sélectionnée");
      return ClasseService.delete(initialData.id);
    },
    onSuccess: () => {
      toast.success("Classe supprimée définitivement.");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error("Impossible de supprimer la classe.");
    },
  });

  const onSubmit = (data: ClasseFormValues) => {
    upsertMutation.mutate(data);
  };

  return {
    form,
    onSubmit,
    deleteMutation,
    upsertMutation,
  };
}

"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ClasseService, type Classe } from "@/services/classe.service";
import { ConfigService } from "@/services/config.service";
import { toast } from "sonner";
import type { ClasseFormValues } from "@/features/classes/schemas/classe-form.schema";

interface UseClasseMutationsProps {
  mode: "add" | "edit" | "view";
  initialData?: Classe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function useClasseMutations({
  mode,
  initialData,
  open,
  onOpenChange,
}: UseClasseMutationsProps) {
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";

  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: ConfigService.getConfig,
    enabled: open && mode === "add",
  });

  const upsertMutation = useMutation({
    mutationFn: (data: ClasseFormValues) => {
      if (isEdit && initialData) {
        return ClasseService.update(initialData.id, data);
      }
      if (!config?.anneeActiveId) {
        throw new Error("Année scolaire non définie");
      }
      return ClasseService.create({
        ...data,
        anneeId: config.anneeActiveId,
      });
    },
    onSuccess: () => {
      toast.success(isEdit ? "Classe mise à jour !" : "Classe créée avec succès !");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ??
        (error as Error)?.message ??
        "Erreur inconnue";
      toast.error("Échec de l'opération: " + message);
    },
  });

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
    onError: () => {
      toast.error("Impossible de supprimer la classe.");
    },
  });

  const submit = (data: ClasseFormValues) => {
    upsertMutation.mutate(data);
  };

  return {
    upsertMutation,
    deleteMutation,
    submit,
  };
}

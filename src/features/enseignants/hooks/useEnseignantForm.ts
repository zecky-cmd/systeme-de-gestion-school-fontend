import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Enseignant, EnseignantService, CreateEnseignantCombinedDto } from "@/services/enseignant.service";
import { toast } from "sonner";

export const enseignantSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  matricule: z.string().min(2, "Le matricule est requis"),
  specialite: z.string().min(2, "La spécialité est requise"),
  telephone: z.string().min(8, "Numéro invalide"),
  statut: z.enum(["actif", "inact"]),
});

export type EnseignantFormValues = z.infer<typeof enseignantSchema>;

interface UseEnseignantFormProps {
  mode: "add" | "edit" | "view";
  initialData?: Enseignant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function useEnseignantForm({ mode, initialData, open, onOpenChange }: UseEnseignantFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<EnseignantFormValues>({
    resolver: zodResolver(enseignantSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      matricule: "",
      specialite: "",
      telephone: "",
      statut: "actif",
    },
  });

  useEffect(() => {
    if (open && initialData && mode !== "add") {
      form.reset({
        nom: initialData.user?.nom || "",
        prenom: initialData.user?.prenom || "",
        email: initialData.user?.email || "",
        matricule: initialData.matricule || "",
        specialite: initialData.specialite || "",
        telephone: initialData.telephone || "",
        statut: initialData.statut,
      });
    } else if (open && mode === "add") {
      form.reset({
        nom: "",
        prenom: "",
        email: "",
        matricule: "",
        specialite: "",
        telephone: "",
        statut: "actif",
      });
    }
  }, [open, initialData, mode, form]);

  const upsertMutation = useMutation({
    mutationFn: async (data: EnseignantFormValues) => {
      if (mode === "edit" && initialData) {
        return EnseignantService.update(initialData.id, initialData.userId, data);
      } else {
        return EnseignantService.createCombined(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enseignants"] });
      toast.success(mode === "edit" ? "Enseignant mis à jour" : "Enseignant ajouté");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (initialData) {
        await EnseignantService.delete(initialData.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enseignants"] });
      toast.success("Enseignant supprimé");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    },
  });

  const onSubmit = (data: EnseignantFormValues) => {
    upsertMutation.mutate(data);
  };

  return {
    form,
    onSubmit,
    upsertMutation,
    deleteMutation,
  };
}

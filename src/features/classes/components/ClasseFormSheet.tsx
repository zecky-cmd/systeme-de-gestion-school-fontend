"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Classe, ClasseService, Cycle } from "@/services/classe.service";
import { ConfigService } from "@/services/config.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, School, Trash2 } from "lucide-react";
import { DeleteConfirm } from "@/components/shared/DeleteConfirm";

/**
 * Schéma de validation Zod
 */
const classeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(30),
  cycle: z.enum(["col", "lyc"]),
  niveau: z.string().min(1, "Le niveau est requis").max(15),
  serie: z.string().max(5).optional(),
  salle: z.string().max(20).optional(),
  capaciteMax: z.number().min(1).default(40),
});

type ClasseFormValues = z.infer<typeof classeSchema>;

interface ClasseFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit" | "view";
  initialData?: Classe | null;
}

export function ClasseFormSheet({ open, onOpenChange, mode, initialData }: ClasseFormSheetProps) {
  const queryClient = useQueryClient();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const isView = mode === "view";
  const isEdit = mode === "edit";

  // Récupérer la config pour avoir l'anneeId active (pour l'ajout)
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: () => ConfigService.getConfig(),
    enabled: open && mode === "add",
  });

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ClasseFormValues>({
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
        reset({
          nom: initialData.nom,
          cycle: initialData.cycle,
          niveau: initialData.niveau,
          serie: initialData.serie || "",
          salle: initialData.salle || "",
          capaciteMax: initialData.capaciteMax || 40,
        });
      } else {
        reset({
          nom: "",
          cycle: "col",
          niveau: "",
          serie: "",
          salle: "",
          capaciteMax: 40,
        });
      }
    }
  }, [open, initialData, reset]);

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
      setIsDeleteConfirmOpen(false); // Fermer le dialogue de confirmation
      onOpenChange(false); // Fermer le volet latéral
    },
    onError: (error: any) => {
      toast.error("Impossible de supprimer la classe.");
    },
  });

  const onSubmit = (data: ClasseFormValues) => {
    upsertMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <DeleteConfirm 
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title="Supprimer la classe ?"
        description={`Êtes-vous sûr de vouloir supprimer la classe "${initialData?.nom}" ? Cette action est irréversible.`}
      />
      <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md p-0 flex flex-col border-l-0 shadow-2xl">
        <SheetHeader className={`p-6 ${isView ? 'bg-slate-800' : isEdit ? 'bg-blue-600' : 'bg-emerald-600'} text-white shrink-0`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <School className="h-5 w-5" />
            </div>
            <SheetTitle className="text-white text-xl font-black uppercase tracking-tight">
              {isView ? "Détails Classe" : isEdit ? "Modifier Classe" : "Nouvelle Classe"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-white/80 text-xs font-medium">
            {isView ? "Consultation des paramètres de la section." : isEdit ? "Modifiez les informations de cette classe." : "Configurez une nouvelle section pédagogique."}
          </SheetDescription>
        </SheetHeader>

        <form 
          id="classe-form"
          onSubmit={handleSubmit(onSubmit)} 
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Nom de la classe</Label>
                <Input 
                  id="nom" 
                  disabled={isView}
                  placeholder="Ex: 6ème A" 
                  className="h-11 font-bold border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:ring-emerald-500/20" 
                  {...register("nom")} 
                />
                {errors.nom && <p className="text-[10px] text-rose-500 font-bold">{errors.nom.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Cycle</Label>
                <Select 
                  disabled={isView}
                  defaultValue={initialData?.cycle || "col"} 
                  onValueChange={(val) => setValue("cycle", val as Cycle)}
                >
                  <SelectTrigger className="h-11 font-bold border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                    <SelectValue placeholder="Cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="col">Collège</SelectItem>
                    <SelectItem value="lyc">Lycée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="niveau" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Niveau</Label>
                <Input 
                  id="niveau" 
                  disabled={isView}
                  placeholder="Ex: 6eme" 
                  className="h-11 font-bold" 
                  {...register("niveau")} 
                />
                {errors.niveau && <p className="text-[10px] text-rose-500 font-bold">{errors.niveau.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serie" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Série (Optionnel)</Label>
                <Input 
                  id="serie" 
                  disabled={isView}
                  placeholder="Ex: S, L" 
                  className="h-11 font-bold" 
                  {...register("serie")} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salle" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Salle</Label>
                <Input 
                  id="salle" 
                  disabled={isView}
                  placeholder="Ex: Salle 101" 
                  className="h-11 font-bold" 
                  {...register("salle")} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capaciteMax" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Capacité Max</Label>
                <Input 
                  id="capaciteMax" 
                  disabled={isView}
                  type="number" 
                  className="h-11 font-bold" 
                  {...register("capaciteMax", { valueAsNumber: true })} 
                />
              </div>
            </div>
            
            {initialData?.totalInscrits !== undefined && (
               <div className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2">Statistiques de remplissage</h4>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900 dark:text-white">{initialData.totalInscrits}</span>
                        <span className="text-xs font-bold text-slate-400">/ {initialData.capaciteMax} élèves</span>
                     </div>
                     <div className="text-right">
                        <span className={`text-xs font-black ${initialData.totalInscrits > (initialData.capaciteMax || 0) ? 'text-rose-500' : 'text-emerald-500'}`}>
                           {Math.round((initialData.totalInscrits / (initialData.capaciteMax || 1)) * 100)}% d'occupation
                        </span>
                     </div>
                  </div>
               </div>
            )}
          </div>
        </form>

        <SheetFooter className="p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 shrink-0 gap-2">
          {isEdit && (
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="h-12 border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-black text-xs uppercase"
              disabled={deleteMutation.isPending || upsertMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="animate-spin" /> : <Trash2 size={18} />}
            </Button>
          )}
          
          {!isView ? (
            <Button 
              type="submit" 
              form="classe-form"
              className={`flex-1 h-12 ${isEdit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-black text-sm uppercase tracking-widest shadow-lg`}
              disabled={upsertMutation.isPending || deleteMutation.isPending}
            >
              {upsertMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  CHARGEMENT...
                </>
              ) : (
                isEdit ? "ENREGISTRER" : "CRÉER LA CLASSE"
              )}
            </Button>
          ) : (
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full h-12 bg-slate-800 text-white font-black text-sm uppercase"
            >
              FERMER
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
    </>
  );
}

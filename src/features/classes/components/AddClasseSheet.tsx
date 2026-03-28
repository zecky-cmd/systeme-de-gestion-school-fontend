"use client";

import React from "react";
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
import { ClasseService, Cycle } from "@/services/classe.service";
import { ConfigService } from "@/services/config.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, School } from "lucide-react";

const classeSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(30),
  cycle: z.enum(["col", "lyc"]),
  niveau: z.string().min(1, "Le niveau est requis").max(15),
  serie: z.string().max(5).optional(),
  salle: z.string().max(20).optional(),
  capaciteMax: z.number().min(1).default(40),
});

type ClasseFormValues = z.infer<typeof classeSchema>;

interface AddClasseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClasseSheet({ open, onOpenChange }: AddClasseSheetProps) {
  const queryClient = useQueryClient();

  // Récupérer la config pour avoir l'anneeId active
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: () => ConfigService.getConfig(),
    enabled: open,
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ClasseFormValues>({
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

  const mutation = useMutation({
    mutationFn: (data: ClasseFormValues) => {
      if (!config?.anneeActiveId) throw new Error("Année scolaire non définie");
      return ClasseService.create({
        ...data,
        anneeId: config.anneeActiveId,
      });
    },
    onSuccess: () => {
      toast.success("Classe créée avec succès !");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error("Échec de la création: " + (error.response?.data?.message || error.message));
    },
  });

  const onSubmit = (data: ClasseFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md p-0 flex flex-col border-l-0 shadow-2xl">
        <SheetHeader className="p-6 bg-emerald-600 text-white shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <School className="h-5 w-5" />
            </div>
            <SheetTitle className="text-white text-xl font-black">Nouvelle Classe</SheetTitle>
          </div>
          <SheetDescription className="text-emerald-50 text-xs font-medium opacity-90">
            Configurez une nouvelle section pédagogique pour l'année en cours.
          </SheetDescription>
        </SheetHeader>

        <form 
          id="add-classe-form"
          onSubmit={handleSubmit(onSubmit)} 
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Nom de la classe</Label>
                <Input 
                  id="nom" 
                  placeholder="Ex: 6ème A" 
                  className="h-11 font-bold border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:ring-emerald-500/20" 
                  {...register("nom")} 
                />
                {errors.nom && <p className="text-[10px] text-rose-500 font-bold">{errors.nom.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Cycle</Label>
                <Select 
                  defaultValue="col" 
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
                  placeholder="Ex: S, L, C" 
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
                  placeholder="Ex: Salle 101" 
                  className="h-11 font-bold" 
                  {...register("salle")} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capaciteMax" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Capacité Max</Label>
                <Input 
                  id="capaciteMax" 
                  type="number" 
                  className="h-11 font-bold" 
                  {...register("capaciteMax", { valueAsNumber: true })} 
                />
              </div>
            </div>
          </div>
        </form>

        <SheetFooter className="p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <Button 
            type="submit" 
            form="add-classe-form"
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                CRÉATION EN COURS...
              </>
            ) : (
              "CRÉER LA CLASSE"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Classe, Cycle } from "@/services/classe.service";
import { ClasseFormValues } from "../../hooks/useClasseForm";

interface ClasseFormFieldsProps {
  form: UseFormReturn<ClasseFormValues>;
  isView?: boolean;
  initialData?: Classe | null;
}

export function ClasseFormFields({ form, isView, initialData }: ClasseFormFieldsProps) {
  const { register, setValue, formState: { errors } } = form;

  return (
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
  );
}

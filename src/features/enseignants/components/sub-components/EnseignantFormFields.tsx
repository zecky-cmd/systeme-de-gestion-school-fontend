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
import { EnseignantFormValues } from "../../hooks/useEnseignantForm";

interface EnseignantFormFieldsProps {
  form: UseFormReturn<EnseignantFormValues>;
  isView?: boolean;
}

export function EnseignantFormFields({ form, isView }: EnseignantFormFieldsProps) {
  const { register, setValue, watch, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b pb-1">Compte Utilisateur</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Nom</Label>
            <Input 
              id="nom" 
              disabled={isView}
              placeholder="Ex: KOUASSI" 
              className="h-11 font-bold border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:ring-emerald-500/20" 
              {...register("nom")} 
            />
            {errors.nom && <p className="text-[10px] text-rose-500 font-bold">{errors.nom.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prenom" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Prénom</Label>
            <Input 
              id="prenom" 
              disabled={isView}
              placeholder="Ex: Jean" 
              className="h-11 font-bold" 
              {...register("prenom")} 
            />
            {errors.prenom && <p className="text-[10px] text-rose-500 font-bold">{errors.prenom.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Adresse Email</Label>
          <Input 
            id="email" 
            disabled={isView}
            type="email"
            placeholder="Ex: jean.kouassi@ecole.com" 
            className="h-11 font-bold" 
            {...register("email")} 
          />
          {errors.email && <p className="text-[10px] text-rose-500 font-bold">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b pb-1">Profil Professionnel</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="matricule" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Matricule</Label>
            <Input 
              id="matricule" 
              disabled={isView}
              placeholder="Ex: ENS24-001" 
              className="h-11 font-bold" 
              {...register("matricule")} 
            />
            {errors.matricule && <p className="text-[10px] text-rose-500 font-bold">{errors.matricule.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialite" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Spécialité</Label>
            <Input 
              id="specialite" 
              disabled={isView}
              placeholder="Ex: Mathématiques" 
              className="h-11 font-bold" 
              {...register("specialite")} 
            />
            {errors.specialite && <p className="text-[10px] text-rose-500 font-bold">{errors.specialite.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telephone" className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Téléphone</Label>
            <Input 
              id="telephone" 
              disabled={isView}
              placeholder="Ex: 0102030405" 
              className="h-11 font-bold" 
              {...register("telephone")} 
            />
            {errors.telephone && <p className="text-[10px] text-rose-500 font-bold">{errors.telephone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Statut</Label>
            <Select 
              disabled={isView}
              value={watch("statut")} 
              onValueChange={(val) => val && setValue("statut", val as "actif" | "inact")}
            >
              <SelectTrigger className="h-11 font-bold border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inact">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

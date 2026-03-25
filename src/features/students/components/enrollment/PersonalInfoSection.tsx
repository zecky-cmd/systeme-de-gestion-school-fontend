"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { StudentFormValues } from "../../schemas/student-form.schema";

interface PersonalInfoSectionProps {
  readonlyNom?: boolean;
  readonlyPrenom?: boolean;
}

export function PersonalInfoSection({ readonlyNom, readonlyPrenom }: PersonalInfoSectionProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<StudentFormValues>();
  
  return (
    <div className="space-y-4 pt-2">
      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b pb-1">Infos Personnelles</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" {...register("nom")} placeholder="KOUASSI" disabled={readonlyNom} />
          {errors.nom && <p className="text-[10px] text-red-500">{errors.nom.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" {...register("prenom")} placeholder="Jean" disabled={readonlyPrenom} />
          {errors.prenom && <p className="text-[10px] text-red-500">{errors.prenom.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sexe</Label>
          <Select 
            value={watch("sexe")} 
            onValueChange={(val: string | null) => {
              if (val === "M" || val === "F") {
                setValue("sexe", val);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sexe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculin</SelectItem>
              <SelectItem value="F">Féminin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="matricule">Matricule</Label>
          <Input id="matricule" {...register("matricule")} placeholder="Ex: 24-001" />
        </div>
      </div>
    </div>
  );
}

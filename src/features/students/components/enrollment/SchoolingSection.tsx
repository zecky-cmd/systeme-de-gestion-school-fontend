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
import { Classe } from "@/services/classe.service";

interface SchoolingSectionProps {
  classes?: Classe[];
}

export function SchoolingSection({ classes }: SchoolingSectionProps) {
  const { register, setValue, formState: { errors } } = useFormContext<StudentFormValues>();
  
  return (
    <>
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b pb-1">Scolarité</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="classeId">Classe d'affectation</Label>
            <Select onValueChange={(val: string | null) => {
              if (typeof val === "string") {
                setValue("classeId", val);
              }
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.classeId && <p className="text-[10px] text-red-500">{errors.classeId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateNaissance">D. Naissance</Label>
            <Input id="dateNaissance" type="date" {...register("dateNaissance")} />
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <Label htmlFor="lieuNaissance">Lieu de naissance & Nationalité</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input id="lieuNaissance" {...register("lieuNaissance")} placeholder="Abidjan" />
          <Input id="nationalite" {...register("nationalite")} placeholder="Ivoirienne" />
        </div>
      </div>
    </>
  );
}

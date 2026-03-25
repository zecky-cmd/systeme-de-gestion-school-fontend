"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StudentFormValues } from "../../schemas/student-form.schema";

export function AccountSection() {
  const { register, formState: { errors } } = useFormContext<StudentFormValues>();
  
  return (
    <div className="space-y-4 pt-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b pb-1">Compte & Accès</h3>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} placeholder="jean.k@email.com" />
        {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe provisoire</Label>
        <Input id="password" type="text" {...register("password")} />
        {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
      </div>
    </div>
  );
}

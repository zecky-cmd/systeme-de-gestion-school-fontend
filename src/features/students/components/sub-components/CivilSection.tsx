"use client";

import React from "react";
import { User, Flag, Mail, Calendar, MapPin } from "lucide-react";

interface CivilSectionProps {
  student: any;
  email: string;
}

export function CivilSection({ student, email }: CivilSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
        <User size={12} className="text-emerald-500" />
        Dossier Civil
      </h3>
      
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="space-y-1.5">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Genre / Sexe</p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{student.sexe === "M" ? "Masculin" : "Féminin"}</p>
        </div>
        
        <div className="space-y-1.5">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Origine / Nationalité</p>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <Flag size={14} className="text-slate-300" />
            {student.nationalite || "Ivoirienne"}
          </div>
        </div>
        
        <div className="space-y-1.5 col-span-2">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Contact Principal (Email)</p>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <Mail size={14} className="text-slate-300" />
            {email}
          </div>
        </div>
        
        <div className="space-y-1.5 col-span-2 border-t pt-3 mt-1">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Naissance & Lieu</p>
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-300" />
              {student.dateNaissance ? new Date(student.dateNaissance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : "Date inconnue"}
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-300" />
              {student.lieuNaissance || "Lieu non renseigné"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

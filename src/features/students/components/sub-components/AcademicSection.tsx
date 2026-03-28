"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AcademicSectionProps {
  student: any;
}

export function AcademicSection({ student }: AcademicSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
        <GraduationCap size={12} className="text-emerald-500" />
        Scolarité
      </h3>
      
      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/50 relative overflow-hidden group hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
          <GraduationCap size={60} className="text-emerald-600" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div className="space-y-1">
            <p className="text-[9px] text-emerald-600/60 font-black uppercase tracking-widest leading-none">Classe Actuelle</p>
            <p className="text-2xl font-black text-emerald-900 dark:text-white leading-tight">
              {student.classe?.nom || "Non affecté"}
            </p>
          </div>
          <Badge variant="secondary" className="bg-emerald-600 text-white border-0 shadow-md shadow-emerald-600/20 text-[10px] font-bold h-6">
            Année 2025-2026
          </Badge>
        </div>
      </div>
    </div>
  );
}

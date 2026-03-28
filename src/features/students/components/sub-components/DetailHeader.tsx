"use client";

import React from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface DetailHeaderProps {
  student: any;
  fullNom: string;
  initials: string;
}

export function DetailHeader({ student, fullNom, initials }: DetailHeaderProps) {
  const photoUrl = student.photoUrl || student.user?.photoUrl;

  return (
    <div className="relative h-32 bg-emerald-600 shrink-0">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/50 to-emerald-900/50" />
      <div className="absolute -bottom-12 left-6 text-left w-full">
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-950 overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center shadow-xl ring-1 ring-black/5 shrink-0 relative">
            {photoUrl ? (
              <img src={photoUrl} alt={fullNom} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-emerald-600 uppercase">{initials}</span>
            )}
            <div className="absolute -bottom-2 -right-2">
              <StatusBadge status={student.statut || "Inscrit"} className="shadow-lg border-2 border-white dark:border-slate-950" />
            </div>
          </div>
          
          <div className="pb-1 space-y-1 mb-1">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none truncate max-w-[200px]">
              {fullNom}
            </h2>
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/50">
                Matricule: {student.matricule || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

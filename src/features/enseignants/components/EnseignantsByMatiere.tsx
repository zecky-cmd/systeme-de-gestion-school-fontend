"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MatiereStats } from "@/services/enseignant.service";
import { BookOpen, Users, Clock } from "lucide-react";

interface EnseignantsByMatiereProps {
  matiereStats: MatiereStats[];
  isLoading?: boolean;
}

export function EnseignantsByMatiere({ matiereStats, isLoading }: EnseignantsByMatiereProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Chargement des matières...</p>
        </div>
      </div>
    );
  }

  if (matiereStats.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-400 italic">Aucune matière configurée.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matiereStats.map((mat) => (
        <Card 
          key={mat.matiereId} 
          className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
        >
          <CardContent className="p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight">
                {mat.nomMatiere}
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase">
                {mat.nombreClasses} classes
              </span>
            </div>

            {/* Liste des enseignants */}
            <div className="space-y-2.5">
              {mat.enseignants.map((ens) => (
                <div key={ens.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    {ens.initiales}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {ens.prenom?.startsWith("M") ? "M." : "Mme"} {ens.nom} {ens.prenom?.[0]}.
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users size={14} />
                <span className="text-xs font-medium">{mat.nombreEnseignants} enseignant(s)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={14} />
                <span className="text-xs font-bold">{mat.totalHeuresSemaine}h / sem</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

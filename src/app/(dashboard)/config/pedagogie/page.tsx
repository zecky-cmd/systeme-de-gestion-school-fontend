"use client";

import React from "react";
import { usePedagogy } from "@/features/config/hooks/usePedagogy";
import { PedagogyView } from "@/features/config/components/PedagogyView";
import { BookOpen } from "lucide-react";

export default function PedagogyPage() {
  const {
    subjects,
    levels,
    updateCoefficients,
    createSubject,
    updateSubject,
    deleteSubject,
    createLevel,
    deleteLevel,
    isSaving
  } = usePedagogy();

  return (
    <div className="flex-1 flex flex-col bg-[oklch(0.98_0.002_240)] min-h-screen">
      {/* Header simplifié */}
      <div className="p-6 border-b border-[oklch(0.91_0.005_240)] bg-white/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">Pédagogie</h2>
            <p className="text-sm text-slate-500">Matières, coefficients et types d'évaluations</p>
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 overflow-auto">
        <PedagogyView 
          subjects={subjects}
          levels={levels}
          onUpdateCoefficients={updateCoefficients}
          onCreateSubject={createSubject}
          onUpdateSubject={updateSubject}
          onDeleteSubject={deleteSubject}
          onCreateLevel={createLevel}
          onDeleteLevel={deleteLevel}
          isSaving={isSaving}
        />
      </main>
    </div>
  );
}

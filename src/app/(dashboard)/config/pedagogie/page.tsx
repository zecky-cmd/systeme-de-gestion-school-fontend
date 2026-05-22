"use client";

import React from "react";
import { usePedagogy } from "@/features/config/hooks/usePedagogy";
import { PedagogyView } from "@/features/config/components/PedagogyView";
import { BookOpen } from "lucide-react";
import { ConfigHeader } from "@/components/shared/ConfigHeader";

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
      <ConfigHeader
        icon={BookOpen}
        title="Pédagogie"
        description="Matières, coefficients et types d'évaluations"
      />
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

import React from "react";
import { AlertTriangle } from "lucide-react";

export function WarningBanner() {
  return (
    <div className="rounded-2xl bg-amber-50/50 p-4 border border-amber-200/60 flex gap-3.5 items-start shadow-sm/5">
      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-800 font-medium leading-relaxed">
        Toute modification des tarifs ne s'appliquera qu'aux nouveaux encaissements. Les paiements déjà effectués ne seront pas affectés.
      </p>
    </div>
  );
}

import React from "react";
import { Copy } from "lucide-react";
import { CategorieTarifaire } from "@/services/finance.service";

interface CopyBarProps {
  otherCategories: CategorieTarifaire[];
  onCopy: (targetCategory: CategorieTarifaire) => void;
}

export function CopyBar({ otherCategories, onCopy }: CopyBarProps) {
  if (otherCategories.length === 0) return null;

  return (
    <div className="rounded-xl bg-slate-100 border border-slate-200 p-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 shadow-sm/5">
      <span className="flex items-center gap-1.5">
        <Copy size={13} className="text-slate-400" />
        Copier les tarifs vers :
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {otherCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCopy(cat)}
            className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-sm cursor-pointer transition-colors text-[11px]"
          >
            {cat.nom}
          </button>
        ))}
      </div>
    </div>
  );
}

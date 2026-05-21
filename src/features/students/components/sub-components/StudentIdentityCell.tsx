"use client";

import { getStudentIdentity } from "@/features/students/utils/student-display.utils";
import type { Eleve } from "@/services/student.service";

interface StudentIdentityCellProps {
  eleve: Eleve;
}

export function StudentIdentityCell({ eleve }: StudentIdentityCellProps) {
  const { nom, prenom, fullName, initials, photoUrl } = getStudentIdentity(eleve);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800/50 overflow-hidden shadow-sm transition-transform group-hover:scale-110">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={fullName}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              if (target.parentElement) {
                target.parentElement.textContent = initials;
              }
            }}
          />
        ) : (
          initials
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-slate-900 dark:text-slate-100 uppercase text-[13px] tracking-tight">
          {nom}
        </span>
        <span className="text-[11px] text-slate-500 font-medium">{prenom}</span>
      </div>
    </div>
  );
}

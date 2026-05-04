"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Enseignant } from "@/services/enseignant.service";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Phone, Hash, Clock, School, Trash2, Calendar, FileText } from "lucide-react";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { cn } from "@/lib/utils";

interface EnseignantRowProps {
  item: Enseignant;
  hoveredCol: number | null;
  onHoverCol: (index: number | null) => void;
  onEdit?: (enseignant: Enseignant) => void;
  onView?: (enseignant: Enseignant) => void;
}

export function EnseignantRow({ item, hoveredCol, onHoverCol, onEdit, onView }: EnseignantRowProps) {
  const cellClass = (index: number) => cn(
    "transition-colors duration-200",
    hoveredCol === index && "bg-slate-50 dark:bg-slate-800/50"
  );

  return (
    <TableRow className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
      {/* Nom & Prénom */}
      <TableCell 
        className={cn(cellClass(0), "pl-6 py-4")}
        onMouseEnter={() => onHoverCol(0)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300">
            {item.user?.nom?.[0]}{item.user?.prenom?.[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {item.user?.nom} {item.user?.prenom}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {item.matricule || "N/A"}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Matière(s) */}
      <TableCell 
        className={cellClass(1)}
        onMouseEnter={() => onHoverCol(1)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <div className="flex flex-wrap gap-1">
          {item.matieres && item.matieres.length > 0 ? (
            item.matieres.map((m, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                {m}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-400 italic">Non assigné</span>
          )}
        </div>
      </TableCell>

      {/* Classes */}
      <TableCell 
        className={cellClass(2)}
        onMouseEnter={() => onHoverCol(2)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            <School size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.classes?.count || 0} CLASSES</span>
          </div>
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {item.classes?.noms && item.classes.noms.slice(0, 3).map((classe, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-[10px] font-bold text-emerald-600 border border-emerald-100 dark:border-emerald-800/30">
                {classe}
              </span>
            ))}
            {item.classes?.count && item.classes.count > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                +{item.classes.count - 3}
              </span>
            )}
          </div>
        </div>
      </TableCell>

      {/* Prof Principal */}
      <TableCell 
        className={cellClass(3)}
        onMouseEnter={() => onHoverCol(3)}
        onMouseLeave={() => onHoverCol(null)}
      >
        {item.classesPrincipales && item.classesPrincipales.length > 0 ? (
          <span className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            {item.classesPrincipales[0]}
          </span>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </TableCell>

      {/* Heures/Sem */}
      <TableCell 
        className={cellClass(4)}
        onMouseEnter={() => onHoverCol(4)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {item.heuresSemaine || 0}h
          </span>
        </div>
      </TableCell>

      {/* Type Contrat */}
      <TableCell 
        className={cellClass(5)}
        onMouseEnter={() => onHoverCol(5)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <span className={cn(
          "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
          item.typeContrat === "permanent"
            ? "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        )}>
          {item.typeContrat || "N/A"}
        </span>
      </TableCell>

      {/* Contact */}
      <TableCell 
        className={cellClass(6)}
        onMouseEnter={() => onHoverCol(6)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <div className="flex flex-col text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">{item.telephone || "—"}</span>
          <span className="text-[10px] text-slate-400">{item.user?.email}</span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell 
        className={cn(cellClass(7), "text-right pr-6")}
        onMouseEnter={() => onHoverCol(7)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <div className="flex justify-end">
          <ActionMenu items={[
            {
              label: "Voir la fiche",
              icon: <Eye size={14} />,
              onClick: () => onView && onView(item),
            },
            {
              label: "Modifier l'enseignant",
              icon: <Edit size={14} />,
              onClick: () => onEdit && onEdit(item),
            },
            {
              label: "Emploi du temps",
              icon: <Calendar size={14} />,
              onClick: () => {},
            },
            {
              label: "Rapport d'activité",
              icon: <FileText size={14} />,
              onClick: () => {},
            },
            {
              label: "Supprimer",
              icon: <Trash2 size={14} />,
              onClick: () => {},
              variant: "danger",
            },
          ]} />
        </div>
      </TableCell>
    </TableRow>
  );
}

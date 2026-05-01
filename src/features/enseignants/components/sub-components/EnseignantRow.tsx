"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Enseignant } from "@/services/enseignant.service";
import { Button } from "@/components/ui/button";
import { Eye, Edit, BookOpen, Phone, Hash } from "lucide-react";
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
              {item.user?.email}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Matricule */}
      <TableCell 
        className={cellClass(1)}
        onMouseEnter={() => onHoverCol(1)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <div className="flex items-center gap-2">
          <Hash size={14} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {item.matricule || "N/A"}
          </span>
        </div>
      </TableCell>

      {/* Spécialité */}
      <TableCell 
        className={cellClass(2)}
        onMouseEnter={() => onHoverCol(2)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {item.specialite || "Non spécifié"}
          </span>
        </div>
      </TableCell>

      {/* Téléphone */}
      <TableCell 
        className={cellClass(3)}
        onMouseEnter={() => onHoverCol(3)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {item.telephone || "N/A"}
          </span>
        </div>
      </TableCell>

      {/* Statut & Actions */}
      <TableCell 
        className={cn(cellClass(4), "text-right pr-6")}
        onMouseEnter={() => onHoverCol(4)}
        onMouseLeave={() => onHoverCol(null)}
      >
        <div className="flex items-center justify-end gap-3">
          <span className={cn(
            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
            item.statut === "actif" 
              ? "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-rose-100/50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
          )}>
            {item.statut}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
              onClick={() => onView && onView(item)}
            >
              <Eye size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
              onClick={() => onEdit && onEdit(item)}
            >
              <Edit size={16} />
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

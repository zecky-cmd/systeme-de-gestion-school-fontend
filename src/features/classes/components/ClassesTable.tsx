"use client";

import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Classe } from "@/services/classe.service";
import { ClasseRow } from "./sub-components/ClasseRow";
import { cn } from "@/lib/utils";

interface ClassesTableProps {
  classes: Classe[];
  isLoading?: boolean;
  onEdit?: (classe: Classe) => void;
  onView?: (classe: Classe) => void;
}

export function ClassesTable({ classes, isLoading, onEdit, onView }: ClassesTableProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const headerClass = (index: number) => cn(
    "font-bold text-slate-500 dark:text-slate-400 uppercase text-[9px] tracking-[0.2em] py-5 transition-colors duration-200",
    hoveredCol === index && "bg-slate-100/80 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
  );

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md shadow-slate-200/50 dark:shadow-none overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80 dark:bg-slate-900/40">
          <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-800">
            <TableHead 
              onMouseEnter={() => setHoveredCol(0)}
              onMouseLeave={() => setHoveredCol(null)}
              className={cn(headerClass(0), "pl-6")}
            >
              Nom / Section
            </TableHead>
            <TableHead 
              onMouseEnter={() => setHoveredCol(1)}
              onMouseLeave={() => setHoveredCol(null)}
              className={headerClass(1)}
            >
              Série
            </TableHead>
            <TableHead 
              onMouseEnter={() => setHoveredCol(2)}
              onMouseLeave={() => setHoveredCol(null)}
              className={headerClass(2)}
            >
              Professeur Principal
            </TableHead>
            <TableHead 
              onMouseEnter={() => setHoveredCol(3)}
              onMouseLeave={() => setHoveredCol(null)}
              className={headerClass(3)}
            >
              Local / Salle
            </TableHead>
            <TableHead 
              onMouseEnter={() => setHoveredCol(4)}
              onMouseLeave={() => setHoveredCol(null)}
              className={headerClass(4)}
            >
              Remplissage & Effectif
            </TableHead>
            <TableHead 
              onMouseEnter={() => setHoveredCol(5)}
              onMouseLeave={() => setHoveredCol(null)}
              className={cn(headerClass(5), "text-right pr-6")}
            >
              Statut
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((item) => (
            <ClasseRow 
              key={item.id} 
              item={item} 
              hoveredCol={hoveredCol}
              onHoverCol={setHoveredCol}
              onEdit={onEdit} 
              onView={onView} 
            />
          ))}
          {classes.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-medium italic">
                Aucune classe ne correspond à vos critères.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

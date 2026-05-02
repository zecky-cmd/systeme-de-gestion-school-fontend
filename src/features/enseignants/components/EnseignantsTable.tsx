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
import { Enseignant } from "@/services/enseignant.service";
import { EnseignantRow } from "./sub-components/EnseignantRow";
import { cn } from "@/lib/utils";

interface EnseignantsTableProps {
  enseignants: Enseignant[];
  isLoading?: boolean;
  onEdit?: (enseignant: Enseignant) => void;
  onView?: (enseignant: Enseignant) => void;
}

const HEADERS = [
  { label: "Enseignant", align: "pl-6" },
  { label: "Matière(s)" },
  { label: "Classes" },
  { label: "Prof. Principal" },
  { label: "Heures/Sem" },
  { label: "Type" },
  { label: "Contact" },
  { label: "Actions", align: "text-right pr-6" },
];

export function EnseignantsTable({ enseignants, isLoading, onEdit, onView }: EnseignantsTableProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Chargement des enseignants...</p>
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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/80 dark:bg-slate-900/40">
            <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-800">
              {HEADERS.map((h, i) => (
                <TableHead
                  key={i}
                  onMouseEnter={() => setHoveredCol(i)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={cn(headerClass(i), h.align)}
                >
                  {h.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {enseignants.map((item) => (
              <EnseignantRow 
                key={item.id} 
                item={item} 
                hoveredCol={hoveredCol}
                onHoverCol={setHoveredCol}
                onEdit={onEdit} 
                onView={onView} 
              />
            ))}
            {enseignants.length === 0 && (
              <TableRow>
                <TableCell colSpan={HEADERS.length} className="h-32 text-center text-slate-400 font-medium italic">
                  Aucun enseignant ne correspond à vos critères.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

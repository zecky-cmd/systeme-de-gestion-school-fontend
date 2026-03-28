"use client";

import React from "react";
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

interface ClassesTableProps {
  classes: Classe[];
  isLoading?: boolean;
  onEdit?: (classe: Classe) => void;
  onView?: (classe: Classe) => void;
}

export function ClassesTable({ classes, isLoading, onEdit, onView }: ClassesTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Chargement des classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800">
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider py-4 pl-6">Classe</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Cycle</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Série</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Prof. Principal</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Salle</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Effectif</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Remplissage</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Statut</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((item) => (
            <ClasseRow 
              key={item.id} 
              item={item} 
              onEdit={onEdit} 
              onView={onView} 
            />
          ))}
          {classes.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-slate-500 font-medium">
                Aucune classe trouvée.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

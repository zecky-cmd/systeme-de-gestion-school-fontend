"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Pencil, 
  School, 
  UserCheck, 
  MapPin, 
  AlertTriangle 
} from "lucide-react";
import { Classe } from "@/services/classe.service";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ClasseRowProps {
  item: Classe;
  onEdit?: (classe: Classe) => void;
  onView?: (classe: Classe) => void;
}

export function ClasseRow({ item, onEdit, onView }: ClasseRowProps) {
  const fillingPercentage = item.capaciteMax 
    ? Math.round(((item.totalInscrits || 0) / item.capaciteMax) * 100) 
    : 0;
  const isSurcharge = fillingPercentage > 100;

  return (
    <TableRow className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-100 dark:border-slate-800">
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 ring-1 ring-emerald-500/10">
            <School className="h-4 w-4" />
          </div>
          <span className="font-black text-slate-900 dark:text-white text-sm">{item.nom}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 border-none text-[10px] py-0 px-2 h-5 font-bold uppercase">
          {item.cycle === 'col' ? 'Collège' : 'Lycée'}
        </Badge>
      </TableCell>
      
      <TableCell>
        <span className="text-sm font-bold text-slate-400">{item.serie || "-"}</span>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <UserCheck className="h-3 w-3 text-slate-400" />
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {item.enseignantPrincipal ? `${item.enseignantPrincipal.nom} ${item.enseignantPrincipal.prenom}` : "Non assigné"}
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1.5 text-slate-400">
          <MapPin className="h-3 w-3" />
          <span className="text-xs font-bold">{item.salle || "-"}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "text-sm font-black",
              isSurcharge ? "text-rose-600" : "text-emerald-700 dark:text-emerald-400"
            )}>
              {item.totalInscrits || 0}
            </span>
            <span className="text-[10px] font-bold text-slate-400">/ {item.capaciteMax || 40}</span>
          </div>
          <div className="flex gap-2 text-[9px] font-bold">
            <span className="text-blue-500">{item.effectifG || 0}G</span>
            <span className="text-pink-500">{item.effectifF || 0}F</span>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="w-[150px]">
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(fillingPercentage, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full transition-all duration-500",
                fillingPercentage > 100 ? "bg-rose-500" : 
                fillingPercentage > 90 ? "bg-amber-500" : "bg-emerald-500"
              )}
            />
          </div>
          <span className={cn(
            "text-[10px] font-black",
            fillingPercentage > 100 ? "text-rose-600" : 
            fillingPercentage > 90 ? "text-amber-600" : "text-emerald-600"
          )}>
            {fillingPercentage}%
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        {isSurcharge ? (
          <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-none py-0 px-2 h-6 text-[9px] font-black uppercase flex items-center gap-1 w-fit">
            <AlertTriangle className="h-3 w-3" />
            Surcharge
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border-emerald-100 dark:border-emerald-800/50 py-0 px-2 h-6 text-[9px] font-black uppercase">
            Actif
          </Badge>
        )}
      </TableCell>
      
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            onClick={() => onView?.(item)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            onClick={() => onEdit?.(item)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

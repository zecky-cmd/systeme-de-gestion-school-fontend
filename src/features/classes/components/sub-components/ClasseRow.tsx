"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  UserCheck, 
  MapPin, 
  AlertTriangle 
} from "lucide-react";
import { Classe } from "@/services/classe.service";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ClasseRowProps {
  item: Classe;
  hoveredCol: number | null;
  onHoverCol: (index: number | null) => void;
  onEdit?: (classe: Classe) => void;
  onView?: (classe: Classe) => void;
}

export function ClasseRow({ item, hoveredCol, onHoverCol, onEdit, onView }: ClasseRowProps) {
  const fillingPercentage = item.capaciteMax 
    ? Math.round(((item.totalInscrits || 0) / item.capaciteMax) * 100) 
    : 0;
  const isSurcharge = fillingPercentage > 100;

  // Crosshair Logic: Row + Column highlighting
  const getCellStyles = (index: number) => {
    const isColHovered = hoveredCol === index;
    return cn(
      "py-5 transition-all duration-150 border-x border-transparent relative",
      // Column Highlight (Vertical line)
      isColHovered && "bg-slate-100/40 dark:bg-emerald-950/20 border-x-slate-200/50 dark:border-x-emerald-500/10",
      // Specific cell hover (The intersection)
      "hover:bg-slate-200/60 dark:hover:bg-emerald-900/40 hover:border-x-slate-300 dark:hover:border-emerald-500/30"
    );
  };

  return (
    <TableRow 
      onClick={() => onView?.(item)}
      onMouseLeave={() => onHoverCol(null)}
      className="group cursor-pointer hover:bg-slate-100/80 dark:hover:bg-emerald-900/10 transition-all border-b border-slate-100 dark:border-slate-800/50"
    >
      <TableCell 
        onMouseEnter={() => onHoverCol(0)}
        className={cn(getCellStyles(0), "pl-6")}
      >
        <div className="flex items-center gap-3">
          {/* Status Dot */}
          <div className="relative flex size-2 shrink-0">
            <span className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
              isSurcharge ? "bg-rose-400" : "bg-emerald-400"
            )}></span>
            <span className={cn(
              "relative inline-flex rounded-full size-2",
              isSurcharge ? "bg-rose-500" : "bg-emerald-500"
            )}></span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {item.nom}
            </span>
            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              {item.niveau}
            </span>
          </div>
        </div>
      </TableCell>
      
      <TableCell 
        onMouseEnter={() => onHoverCol(1)}
        className={getCellStyles(1)}
      >
        <span className="text-sm font-bold text-slate-400 dark:text-slate-500">{item.serie || "—"}</span>
      </TableCell>
      
      <TableCell 
        onMouseEnter={() => onHoverCol(2)}
        className={getCellStyles(2)}
      >
        <div className="flex items-center gap-2">
          <UserCheck className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className={cn(
            "text-xs",
            item.enseignantPrincipal ? "text-slate-700 dark:text-slate-300 font-bold" : "text-slate-300 dark:text-slate-600 italic font-medium"
          )}>
            {item.enseignantPrincipal ? `${item.enseignantPrincipal.nom} ${item.enseignantPrincipal.prenom}` : "—"}
          </span>
        </div>
      </TableCell>
      
      <TableCell 
        onMouseEnter={() => onHoverCol(3)}
        className={getCellStyles(3)}
      >
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className={cn(
             "text-xs",
             item.salle ? "text-slate-700 dark:text-slate-300 font-bold" : "text-slate-300 dark:text-slate-600 italic font-medium"
          )}>
            {item.salle || "—"}
          </span>
        </div>
      </TableCell>
      
      <TableCell 
        onMouseEnter={() => onHoverCol(4)}
        className={getCellStyles(4)}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col shrink-0">
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-base font-black leading-none",
                isSurcharge ? "text-rose-600" : "text-slate-900 dark:text-white"
              )}>
                {item.totalInscrits || 0}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">/ {item.capaciteMax || 40}</span>
            </div>
            <div className="flex gap-2 text-[9px] font-black mt-1">
              <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1 rounded-sm">{item.effectifG || 0}G</span>
              <span className="text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-1 rounded-sm">{item.effectifF || 0}F</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-[80px] max-w-[120px] space-y-1">
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-300/30 dark:border-slate-800/50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(fillingPercentage, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full shadow-sm",
                  fillingPercentage > 100 ? "bg-rose-500" : 
                  fillingPercentage > 90 ? "bg-amber-500" : "bg-emerald-500"
                )}
              />
            </div>
          </div>
        </div>
      </TableCell>
      
      <TableCell 
        onMouseEnter={() => onHoverCol(5)}
        className={cn(getCellStyles(5), "text-right pr-6")}
      >
        <div className="flex items-center justify-end gap-2">
          {isSurcharge && (
             <div className="mr-2 flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded text-[9px] font-black uppercase ring-1 ring-rose-500/10">
               <AlertTriangle size={10} />
               Surcharge
             </div>
          )}
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-slate-400 dark:text-slate-500 opacity-40 group-hover:opacity-100 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(item);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

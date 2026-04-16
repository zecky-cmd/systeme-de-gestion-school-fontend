"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Trash2, 
  CreditCard, 
  Smartphone, 
  Banknote,
  ExternalLink 
} from "lucide-react";
import { Paiement, ModePaiement } from "@/services/paiement.service";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PaymentRowProps {
  item: Paiement;
  hoveredCol: number | null;
  onHoverCol: (index: number | null) => void;
  onDelete?: (id: number) => void;
  onShowReceipt?: (url: string) => void;
}

export function PaymentRow({ item, hoveredCol, onHoverCol, onDelete, onShowReceipt }: PaymentRowProps) {
  
  const getModeIcon = (mode: ModePaiement) => {
    switch (mode) {
      case "esp": return <Banknote className="h-4 w-4 text-emerald-500" />;
      case "mobile": return <Smartphone className="h-4 w-4 text-orange-500" />;
      case "cheque": return <CreditCard className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const getModeLabel = (mode: ModePaiement) => {
    switch (mode) {
      case "esp": return "Espèces";
      case "mobile": return "Mobile Money";
      case "cheque": return "Chèque";
      default: return mode;
    }
  };

  const getCellStyles = (index: number) => {
    const isColHovered = hoveredCol === index;
    return cn(
      "py-5 transition-all duration-150 border-x border-transparent relative",
      isColHovered && "bg-slate-100/40 dark:bg-emerald-950/20 border-x-slate-200/50 dark:border-x-emerald-500/10",
      "hover:bg-slate-200/60 dark:hover:bg-emerald-900/40 hover:border-x-slate-300 dark:hover:border-emerald-500/30"
    );
  };

  return (
    <TableRow 
      onMouseLeave={() => onHoverCol(null)}
      className="group hover:bg-slate-100/80 dark:hover:bg-emerald-900/10 transition-all border-b border-slate-100 dark:border-slate-800/50"
    >
      <TableCell 
        onMouseEnter={() => onHoverCol(0)}
        className={cn(getCellStyles(0), "pl-6")}
      >
        <div className="flex flex-col">
          <span className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {item.eleve?.nom} {item.eleve?.prenom}
          </span>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mt-0.5">
            {item.eleve?.matricule} • {item.eleve?.classe?.nom || "—"}
          </span>
        </div>
      </TableCell>
      
      <TableCell 
        onMouseEnter={() => onHoverCol(1)}
        className={getCellStyles(1)}
      >
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
          {item.rubrique?.nom || "Scolarité"}
        </span>
      </TableCell>
      
      <TableCell 
        onMouseEnter={() => onHoverCol(2)}
        className={getCellStyles(2)}
      >
        <div className="flex flex-col">
          <span className="text-base font-black text-slate-900 dark:text-white">
            {item.montant.toLocaleString()} F
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
            {format(new Date(item.datePaiement), "d MMM yyyy", { locale: fr })}
          </span>
        </div>
      </TableCell>
      
      <TableCell 
        onMouseEnter={() => onHoverCol(3)}
        className={getCellStyles(3)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-100 dark:ring-slate-700">
            {getModeIcon(item.mode)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {getModeLabel(item.mode)}
            </span>
            {item.reference && (
              <span className="text-[9px] text-slate-400 font-medium">Ref: {item.reference}</span>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell 
        onMouseEnter={() => onHoverCol(4)}
        className={cn(getCellStyles(4), "text-right pr-6")}
      >
        <div className="flex items-center justify-end gap-2">
          {item.pdfUrl && (
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 opacity-70 group-hover:opacity-100 hover:bg-blue-100 transition-all rounded-full"
              onClick={() => onShowReceipt?.(item.pdfUrl!)}
            >
              <FileText className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-slate-400 dark:text-slate-500 opacity-40 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(item.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

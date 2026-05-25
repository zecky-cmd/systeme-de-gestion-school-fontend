"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Eye,
  Smartphone,
  Banknote,
  Landmark,
  User
} from "lucide-react";
import { Paiement, ModePaiement } from "@/services/paiement.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PaymentRowProps {
  item: Paiement;
  onDelete?: (id: number) => void;
  onShowReceipt?: (url: string) => void;
}

export function PaymentRow({ item, onDelete, onShowReceipt }: PaymentRowProps) {
  
  const getModeBadge = (mode: ModePaiement, ref?: string) => {
    // Especes
    if (mode === "esp") {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
          <Banknote size={13} />
          <span className="text-[11px] font-bold">Especes</span>
        </div>
      );
    }
    
    // Virement / Cheque
    if (mode === "cheque" || mode === "virement" as any) {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          <Landmark size={13} />
          <span className="text-[11px] font-bold">Virement bancaire</span>
        </div>
      );
    }
    
    // Mobile Money
    const lowerRef = (ref || "").toLowerCase();
    if (lowerRef.includes("mtn")) {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
          <Smartphone size={13} />
          <span className="text-[11px] font-bold">MTN Money</span>
        </div>
      );
    }
    if (lowerRef.includes("wave")) {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
          <Smartphone size={13} />
          <span className="text-[11px] font-bold">Wave</span>
        </div>
      );
    }
    // Default Mobile Money (Orange Money style)
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">
        <Smartphone size={13} />
        <span className="text-[11px] font-bold">Orange Money</span>
      </div>
    );
  };

  return (
    <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-b border-slate-100 dark:border-slate-800/50">
      
      {/* DATE */}
      <TableCell className="pl-6 py-4">
        <span className="text-sm text-slate-600 font-medium">
          {format(new Date(item.datePaiement), "dd/MM/yyyy", { locale: fr })}
        </span>
      </TableCell>
      
      {/* REF. */}
      <TableCell className="py-4">
        <span className="text-sm text-slate-500 font-medium">
          {item.reference || `PAY-${new Date(item.datePaiement).getFullYear()}-${item.id.toString().padStart(4, '0')}`}
        </span>
      </TableCell>
      
      {/* ELEVE */}
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
            <User size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {item.eleve?.nom || item.eleve?.user?.nom} {item.eleve?.prenom || item.eleve?.user?.prenom}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {item.eleve?.matricule} • {item.eleve?.classeNom || "Non inscrit"}
            </span>
          </div>
        </div>
      </TableCell>
      
      {/* CLASSE */}
      <TableCell className="py-4">
        <span className="text-sm text-slate-600 font-medium">
          {item.eleve?.classeNom || "Non inscrit"}
        </span>
      </TableCell>
      
      {/* RUBRIQUE */}
      <TableCell className="py-4">
        <span className="text-sm text-slate-600 font-medium">
          {item.rubrique?.nom || "Scolarité"}
        </span>
      </TableCell>
      
      {/* MONTANT */}
      <TableCell className="py-4">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {item.montant.toLocaleString()} F
        </span>
      </TableCell>
      
      {/* MODE */}
      <TableCell className="py-4">
        {getModeBadge(item.mode, item.reference)}
      </TableCell>
      
      {/* RECU */}
      <TableCell className="text-right pr-6 py-4">
        <div className="flex items-center justify-end">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              if (item.pdfUrl) onShowReceipt?.(item.pdfUrl);
            }}
          >
            <Eye size={18} />
          </Button>
        </div>
      </TableCell>
      
    </TableRow>
  );
}

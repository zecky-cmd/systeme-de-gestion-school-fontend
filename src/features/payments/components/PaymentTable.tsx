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
import { Paiement } from "@/services/paiement.service";
import { PaymentRow } from "./PaymentRow";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface PaymentTableProps {
  payments: Paiement[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onShowReceipt?: (url: string) => void;
}

export function PaymentTable({ payments, isLoading, onDelete, onShowReceipt }: PaymentTableProps) {
  
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in transition-all">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-emerald-500/20"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Analyse des finances...</p>
        </div>
      </div>
    );
  }

  const headerClass = "font-bold text-slate-500 uppercase text-[11px] tracking-wider py-4";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className={cn(headerClass, "pl-6 w-[120px]")}>DATE</TableHead>
              <TableHead className={cn(headerClass, "w-[140px]")}>REF.</TableHead>
              <TableHead className={headerClass}>ELEVE</TableHead>
              <TableHead className={headerClass}>CLASSE</TableHead>
              <TableHead className={headerClass}>RUBRIQUE</TableHead>
              <TableHead className={headerClass}>MONTANT</TableHead>
              <TableHead className={headerClass}>MODE</TableHead>
              <TableHead className={cn(headerClass, "text-right pr-6")}>RECU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((item) => (
              <PaymentRow 
                key={item.id} 
                item={item} 
                onDelete={onDelete}
                onShowReceipt={onShowReceipt}
              />
            ))}
            {payments.length === 0 && !isLoading && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <div className="h-12 w-12 rounded-full border-2 border-slate-300 flex items-center justify-center">
                      <span className="text-xl font-black">?</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Aucun versement trouvé</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}

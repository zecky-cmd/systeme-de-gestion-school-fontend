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
import { Paiement } from "@/services/paiement.service";
import { PaymentRow } from "./PaymentRow";
import { cn } from "@/lib/utils";

interface PaymentTableProps {
  payments: Paiement[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onShowReceipt?: (url: string) => void;
}

export function PaymentTable({ payments, isLoading, onDelete, onShowReceipt }: PaymentTableProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in transition-all">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-emerald-500/20"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Analyse des finances...</p>
        </div>
      </div>
    );
  }

  const headerClass = (index: number) => cn(
    "font-black text-slate-400 dark:text-slate-500 uppercase text-[9px] tracking-[0.2em] py-5 transition-colors duration-200 border-x border-transparent",
    hoveredCol === index && "bg-slate-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-x-slate-100 dark:border-x-emerald-500/10"
  );

  return (
    <div className="rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-all duration-500">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800">
          <TableRow className="hover:bg-transparent transition-none border-none">
            <TableHead 
              onMouseEnter={() => setHoveredCol(0)}
              onMouseLeave={() => setHoveredCol(null)}
              className={cn(headerClass(0), "pl-6 rounded-tl-[2.5rem]")}
            >
              Élève / Classe
            </TableHead>
            <TableHead 
              onMouseEnter={() => setHoveredCol(1)}
              onMouseLeave={() => setHoveredCol(null)}
              className={headerClass(1)}
            >
              Rubrique
            </TableHead>
            <TableHead 
              onMouseEnter={() => setHoveredCol(2)}
              onMouseLeave={() => setHoveredCol(null)}
              className={headerClass(2)}
            >
              Montant & Date
            </TableHead>
            <TableHead 
              onMouseEnter={() => setHoveredCol(3)}
              onMouseLeave={() => setHoveredCol(null)}
              className={headerClass(3)}
            >
              Mode & Référence
            </TableHead>
            <TableHead 
              onMouseEnter={() => setHoveredCol(4)}
              onMouseLeave={() => setHoveredCol(null)}
              className={cn(headerClass(4), "text-right pr-6 rounded-tr-[2.5rem]")}
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((item) => (
            <PaymentRow 
              key={item.id} 
              item={item} 
              hoveredCol={hoveredCol}
              onHoverCol={setHoveredCol}
              onDelete={onDelete}
              onShowReceipt={onShowReceipt}
            />
          ))}
          {payments.length === 0 && !isLoading && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="h-48 text-center">
                <div className="flex flex-col items-center gap-2 opacity-30">
                  <div className="h-12 w-12 rounded-full border-2 border-slate-300 flex items-center justify-center">
                    <span className="text-xl font-black">?</span>
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Aucun versement trouvé</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import React from "react";
import { CreditCard, Loader2, Plus } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

interface FinanceSectionProps {
  isLoadingFinance: boolean;
  situation: any;
  onHistoryOpen: () => void;
  onAddPaymentOpen: () => void;
}

export function FinanceSection({ 
  isLoadingFinance, 
  situation, 
  onHistoryOpen, 
  onAddPaymentOpen 
}: FinanceSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
        <CreditCard size={12} className="text-emerald-500" />
        Finances
      </h3>
      <div className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm ring-1 ring-black/[0.02] hover:ring-black/[0.05] transition-all">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Solde restant</p>
          <div className="flex items-baseline gap-1">
            {isLoadingFinance ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            ) : (
              <>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {situation?.resteAPayer?.toLocaleString('fr-FR') || "0"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">CFA</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right space-y-2">
          <StatusBadge 
            status={situation?.statut || "Complet"} 
            variant="payment" 
            className="h-7 px-4 text-[10px] border-0 shadow-sm" 
          />
          <div className="flex items-center justify-end gap-3 pt-1">
            <p 
              className="text-[10px] text-emerald-500 font-bold underline cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={onHistoryOpen}
            >
              Historique
            </p>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all border border-emerald-100 dark:border-emerald-800/50 shadow-sm overflow-hidden"
              onClick={onAddPaymentOpen}
            >
              <Plus size={12} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

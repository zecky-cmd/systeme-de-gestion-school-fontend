"use client";

import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { PaiementService } from "@/services/paiement.service";
import { Loader2, Receipt, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PaymentHistorySheetProps {
  eleveId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentHistorySheet({ eleveId, open, onOpenChange }: PaymentHistorySheetProps) {
  const { data: history, isLoading } = useQuery({
    queryKey: ["payment-history", eleveId],
    queryFn: () => PaiementService.getHistory(eleveId),
    enabled: open && !!eleveId,
  });

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "esp": return "Espèces";
      case "vrt": return "Virement";
      case "chq": return "Chèque";
      case "mob": return "Mobile Money";
      default: return mode;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 bg-slate-50 dark:bg-slate-900 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
              <Receipt size={24} />
            </div>
            <div>
              <SheetTitle className="text-xl font-black">Historique des Paiements</SheetTitle>
              <SheetDescription>Consultez tous les versements effectués pour cet élève.</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm text-slate-500 font-medium">Chargement du grand livre...</p>
            </div>
          ) : history?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300">
                <Receipt size={24} />
              </div>
              <p className="text-slate-500 font-medium italic">Aucun paiement enregistré pour le moment.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Date</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Rubrique</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Mode</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history?.map((p) => (
                  <TableRow key={p.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {format(new Date(p.datePaiement), "dd MMM yyyy", { locale: fr })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Ref: {p.reference || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-bold uppercase">
                        {p.rubrique?.nom || "Divers"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <CreditCard size={12} />
                        <span className="text-[11px] font-medium">{getModeLabel(p.modePaiement)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        {p.montant.toLocaleString('fr-FR')} CFA
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

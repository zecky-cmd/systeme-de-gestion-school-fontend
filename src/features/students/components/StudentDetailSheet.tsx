"use client";

import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetFooter
} from "@/components/ui/sheet";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { PaiementService } from "@/services/paiement.service";
import { PaymentHistorySheet } from "./payments/PaymentHistorySheet";
import { AddPaymentDialog } from "./payments/AddPaymentDialog";

// Sub-components
import { DetailHeader } from "./sub-components/DetailHeader";
import { CivilSection } from "./sub-components/CivilSection";
import { AcademicSection } from "./sub-components/AcademicSection";
import { FinanceSection } from "./sub-components/FinanceSection";

interface StudentDetailSheetProps {
  student: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (student: any) => void;
}

export function StudentDetailSheet({ student, open, onOpenChange, onEdit }: StudentDetailSheetProps) {
  if (!student) return null;

  const nom = student.nom || student.user?.nom || "Non renseigné";
  const prenom = student.prenom || student.user?.prenom || "";
  const fullNom = `${nom} ${prenom}`;
  const email = student.email || student.user?.email || "Pas d'email";
  const initials = nom.substring(0, 1) + (prenom.substring(0, 1) || "");

  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = React.useState(false);

  // Récupérer la situation financière réelle
  const { data: situation, isLoading: isLoadingFinance } = useQuery({
    queryKey: ["finance-situation", student.id],
    queryFn: () => PaiementService.getSituation(student.id),
    enabled: open && !!student.id,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md p-0 overflow-hidden flex flex-col border-l-0 shadow-2xl">
        
        <DetailHeader student={student} fullNom={fullNom} initials={initials} />

        <div className="mt-14 px-6 pb-4 flex-1 overflow-y-auto space-y-8 scrollbar-none">
          <CivilSection student={student} email={email} />
          <AcademicSection student={student} />
          <FinanceSection 
            isLoadingFinance={isLoadingFinance}
            situation={situation}
            onHistoryOpen={() => setIsHistoryOpen(true)}
            onAddPaymentOpen={() => setIsAddPaymentOpen(true)}
          />
        </div>

        {/* Modal & Sheets Financiers */}
        <PaymentHistorySheet 
          eleveId={student.id} 
          open={isHistoryOpen} 
          onOpenChange={setIsHistoryOpen} 
        />
        <AddPaymentDialog 
          eleveId={student.id} 
          open={isAddPaymentOpen} 
          onOpenChange={setIsAddPaymentOpen} 
        />

        {/* Footer avec Actions Rapides */}
        <SheetFooter className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 gap-2 sm:justify-between shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 h-10 border-red-100 hover:bg-red-50 hover:text-red-600 text-slate-400 border-dashed dark:border-slate-800 dark:hover:bg-red-900/20 transition-all font-bold text-xs"
          >
            <Trash2 size={14} className="mr-2" />
            Supprimer
          </Button>
          <Button 
            size="sm"
            onClick={() => onEdit?.(student)}
            className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-xl shadow-slate-200 dark:shadow-emerald-900/20 transition-all font-black text-xs uppercase tracking-wider"
          >
            <Pencil size={14} className="mr-2" />
            Modifier le Profil
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

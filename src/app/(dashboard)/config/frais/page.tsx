"use client";

import React from "react";
import { useFinance } from "@/features/config/hooks/useFinance";
import { FinanceView } from "@/features/config/components/FinanceView";
import { Banknote } from "lucide-react";
import { ConfigHeader } from "@/components/shared/ConfigHeader";

export default function FinancePage() {
  const { fees, updateFee } = useFinance();

  return (
    <div className="flex-1 flex flex-col bg-[oklch(0.98_0.002_240)] min-h-screen">
      <ConfigHeader
        icon={Banknote}
        title="Frais Scolarité"
        description="Gestion des rubriques et tarifs par niveau"
      />

      <main className="flex-1 p-6 overflow-auto">
        <FinanceView fees={fees} onUpdateFee={updateFee} />
      </main>
    </div>
  );
}

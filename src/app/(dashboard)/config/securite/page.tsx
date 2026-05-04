"use client";

import React from "react";
import { SecurityView } from "@/features/config/components/SecurityView";
import { ShieldCheck } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="flex-1 flex flex-col bg-[oklch(0.98_0.002_240)] min-h-screen">
      <div className="p-6 border-b border-[oklch(0.91_0.005_240)] bg-white/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">Sécurité</h2>
            <p className="text-sm text-slate-500">Mots de passe, sessions et journal d'audit</p>
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 overflow-auto">
        <SecurityView />
      </main>
    </div>
  );
}

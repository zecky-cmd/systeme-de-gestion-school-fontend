"use client";

import React from "react";
import { SecurityView } from "@/features/config/components/SecurityView";
import { ShieldCheck } from "lucide-react";
import { ConfigHeader } from "@/components/shared/ConfigHeader";
import { UnderConstruction } from "@/components/shared/UnderConstruction";

export default function SecurityPage() {
  return (
    <>
      <UnderConstruction />
      {/* <div className="flex-1 flex flex-col bg-[oklch(0.98_0.002_240)] min-h-screen">
      <ConfigHeader
        icon={ShieldCheck}
        title="Sécurité"
        description="Mots de passe, sessions et journal d'audit"
      />

      <main className="flex-1 p-6 overflow-auto">
    
      </main>
    </div> */}
    </>
  );
}

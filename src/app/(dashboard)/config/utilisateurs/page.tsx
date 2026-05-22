"use client";

import React from "react";
import { UserManagementView } from "@/features/config/components/UserManagementView";
import { Users } from "lucide-react";
import { ConfigHeader } from "@/components/shared/ConfigHeader";

export default function UsersPage() {
  return (
    <div className="flex-1 flex flex-col bg-[oklch(0.98_0.002_240)] min-h-screen">
      <ConfigHeader
        icon={Users}
        title="Utilisateurs & Accès"
        description="Gérez les comptes et consultez les droits d'accès"
      />

      <main className="flex-1 p-6 overflow-auto">
        <UserManagementView />
      </main>
    </div>
  );
}

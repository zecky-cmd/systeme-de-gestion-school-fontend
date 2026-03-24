"use client";

import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { Separator } from "@/components/ui/separator";
import { UserDropdown } from "@/components/user-dropdown";

export function DashboardHeader() {
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-1.5 overflow-hidden text-sidebar-foreground">
          <span className="text-sm font-bold truncate">Tableau de bord</span>
          <span className="text-slate-400">—</span>
          <span className="text-xs text-slate-500 font-medium truncate">2025-2026</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Actions secondaires */}
        <div className="flex items-center gap-1.5 pr-2">
          <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900" />
          </button>
        </div>

        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* Profil Utilisateur avec Dropdown */}
        <div className="pl-1 sm:pl-2">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}


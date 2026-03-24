"use client";

import { Bell, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/store/authStore";
import { Separator } from "@/components/ui/separator";

export function DashboardHeader() {
  const { user } = useAuthStore();

  // Initiales de l'utilisateur
  const initials = user ? `${user.nom.substring(0, 1)}${user.prenom.substring(0, 1)}` : "AD";
  const fullName = user ? `${user.nom} ${user.prenom}` : "Utilisateur";
  const roleLabel = user?.role === "adm" ? "Administrateur" : 
                    user?.role === "dir" ? "Directeur" : 
                    user?.role === "ens" ? "Enseignant" : "Parent/Élève";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-1.5 overflow-hidden">
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate">Tableau de bord</span>
          <span className="text-slate-400">—</span>
          <span className="text-xs text-slate-500 font-medium truncate">Année 2025-2026</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Actions secondaires */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900" />
          </button>
        </div>

        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* Profil Utilisateur */}
        <div className="flex items-center gap-3 pl-1 sm:pl-2 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 p-1 rounded-full transition-colors">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs ring-2 ring-emerald-500/10 shadow-sm">
            {initials}
          </div>
          <div className="hidden md:flex flex-col text-left leading-tight">
            <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{fullName}</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{roleLabel}</span>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
        </div>
      </div>
    </header>
  );
}

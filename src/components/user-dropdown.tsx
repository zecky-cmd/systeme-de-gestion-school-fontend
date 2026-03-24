"use client";

import { useState, useRef, useEffect } from "react";
import { 
  User as UserIcon, 
  Settings, 
  Sparkles, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon, 
  Monitor,
  ChevronDown,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();

  // Initiales et infos
  const initials = user ? `${user.nom.substring(0, 1)}${user.prenom.substring(0, 1)}` : "AD";
  const fullName = user ? `${user.nom} ${user.prenom}` : "Utilisateur";
  const email = user?.email || "utilisateur@edumanager.ci";

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Fermer au clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themes = [
    { id: "light", label: "Clair", icon: Sun },
    { id: "dark", label: "Sombre", icon: Moon },
    { id: "system", label: "Système", icon: Monitor },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-1 sm:pl-2 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 p-1 rounded-full transition-all duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs ring-2 ring-emerald-500/10 shadow-sm transition-transform group-active:scale-95">
          {initials}
        </div>
        <div className="hidden md:flex flex-col text-left leading-tight mr-1">
          <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{fullName}</span>
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{user?.role === "adm" ? "Administrateur" : "Utilisateur"}</span>
        </div>
        <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none z-50 overflow-hidden"
          >
            {/* Header section */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm">
                  {initials}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{fullName}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{email}</span>
                </div>
              </div>
            </div>

            {/* Menu Sections */}
            <div className="p-2 space-y-0.5">
              <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors">
                <UserIcon size={18} />
                <span>Préférences du compte</span>
              </button>
              <button className="flex w-full items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <Sparkles size={18} />
                  <span>Nouveautés</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-[10px] px-1.5 border-none">
                  3 nouvelles
                </Badge>
              </button>
              <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors">
                <HelpCircle size={18} />
                <span>Aide & support</span>
              </button>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800/60 mx-2" />

            {/* Theme section */}
            <div className="p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 block">Thème</span>
              <div className="space-y-1">
                {themes.map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-sm rounded-xl transition-all",
                      theme === t.id 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-medium" 
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <t.icon size={18} />
                      <span>{t.label}</span>
                    </div>
                    {theme === t.id && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800/60 mx-2" />

            {/* Logout section */}
            <div className="p-2">
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

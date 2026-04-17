"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  UserPlus, 
  BookOpen, 
  ClipboardCheck, 
  FileText,
  Mail,
  Search
} from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      label: "Encaisser",
      description: "Nouveau versement",
      icon: Wallet,
      href: "/paiements",
      color: "bg-emerald-500",
      shadow: "shadow-emerald-500/20"
    },
    {
      label: "Inscrire",
      description: "Nouvel élève",
      icon: UserPlus,
      href: "/eleves",
      color: "bg-blue-500",
      shadow: "shadow-blue-500/20"
    },
    {
      label: "Emploi de temps",
      description: "Gérer planning",
      icon: BookOpen,
      href: "/emplois",
      color: "bg-indigo-500",
      shadow: "shadow-indigo-500/20"
    },
    {
      label: "Notes",
      description: "Saisie collective",
      icon: ClipboardCheck,
      href: "/notes",
      color: "bg-amber-500",
      shadow: "shadow-amber-500/20"
    },
    {
      label: "Bulletins",
      description: "Générer & Publier",
      icon: FileText,
      href: "/notes",
      color: "bg-rose-500",
      shadow: "shadow-rose-500/20"
    },
    {
      label: "Messagerie",
      description: "Envoi massif",
      icon: Mail,
      href: "/messagerie",
      color: "bg-slate-700",
      shadow: "shadow-slate-500/20"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Actions Rapides</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Accès direct aux modules clés</p>
        </div>
        <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
           <Search size={18} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <Link 
              href={action.href}
              className="flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all hover:shadow-xl relative overflow-hidden h-full"
            >
              <div className={`size-10 rounded-xl ${action.color} text-white flex items-center justify-center shadow-lg ${action.shadow} mb-4 transition-transform group-hover:scale-110 duration-300`}>
                <action.icon size={20} />
              </div>
              
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                {action.label}
              </span>
              <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                {action.description}
              </span>

              {/* Decorative line */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 ${action.color}`} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

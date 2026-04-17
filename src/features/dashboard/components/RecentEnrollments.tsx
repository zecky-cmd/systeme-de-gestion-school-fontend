"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DashboardStats } from "@/services/dashboard.service";

interface RecentEnrollmentsProps {
  inscriptions: DashboardStats["inscriptionsRecentes"];
  isLoading: boolean;
}

export function RecentEnrollments({ inscriptions, isLoading }: RecentEnrollmentsProps) {
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-4">
        <div className="h-6 w-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 w-full bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <UserPlus size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Dernières Inscriptions</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Nouveaux élèves cette semaine</p>
          </div>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 group">
          Tout Voir
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="px-4 pb-4">
        {inscriptions.length > 0 ? (
          <div className="space-y-1">
            {inscriptions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {item.nom[0]}{item.prenom[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                      {item.nom} {item.prenom}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                        {item.classe?.nom || "Non assigné"}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {item.matricule}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                    <Calendar size={12} />
                    {format(new Date(item.date), "dd MMM yyyy", { locale: fr })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-200">
              <UserPlus size={32} />
            </div>
            <p className="text-sm font-bold text-slate-400">Aucune inscription récente</p>
          </div>
        )}
      </div>
    </div>
  );
}

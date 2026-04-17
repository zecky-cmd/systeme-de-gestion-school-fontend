"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  UserPlus, 
  CalendarCheck,
  Building2 
} from "lucide-react";
import { DashboardStats as StatsType } from "@/services/dashboard.service";

interface DashboardStatsProps {
  stats?: StatsType;
  isLoading: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const cards = [
    {
      label: "Effectif Total",
      value: stats?.totalEleves || 0,
      icon: Users,
      color: "from-emerald-600 to-teal-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-700 dark:text-emerald-400",
      trend: "+12%",
      description: "Élèves inscrits actifs"
    },
    {
      label: "Classes",
      value: stats?.totalClasses || 0,
      icon: Building2,
      color: "from-blue-600 to-cyan-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-400",
      trend: "Stable",
      description: "Sections pédagogiques"
    },
    {
      label: "Taux de Recouvrement",
      value: `${stats?.tauxPaiement || 0}%`,
      icon: TrendingUp,
      color: "from-amber-600 to-orange-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-400",
      trend: "+5.2%",
      description: "Paiements validés"
    },
    {
      label: "Absences Jour",
      value: stats?.absencesAujourdhui || 0,
      icon: CalendarCheck,
      color: "from-rose-600 to-pink-500",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      textColor: "text-rose-700 dark:text-rose-400",
      trend: "-2%",
      description: "Élèves absents ce jour"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1"
        >
          {/* Background Glow */}
          <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${card.color} opacity-0 blur-3xl transition-opacity group-hover:opacity-10`} />

          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${card.bg} ${card.textColor} transition-transform group-hover:scale-110 duration-300`}>
              <card.icon size={24} strokeWidth={2.5} />
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${card.trend.startsWith('+') ? 'text-emerald-500' : card.trend === 'Stable' ? 'text-slate-400' : 'text-rose-500'}`}>
              {card.trend}
              <TrendingUp size={12} className={card.trend.startsWith('-') ? 'rotate-180' : ''} />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {card.label}
            </h3>
            {isLoading ? (
              <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </span>
              </div>
            )}
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 pt-1">
              {card.description}
            </p>
          </div>

          {/* Bottom Progress Line */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-500 w-0 group-hover:w-full opacity-50" 
               style={{ backgroundImage: `linear-gradient(to right, transparent, ${card.textColor.split(' ')[0]})` }} />
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import React from "react";
import { 
  TrendingUp, 
  Wallet, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PaymentStatsProps {
  stats: {
    totalEncasse: number;
    totalCreances: number;
    tauxRecouvrement: number;
    paiementsDuJour: number;
  };
  isLoading?: boolean;
}

export function PaymentStats({ stats, isLoading }: PaymentStatsProps) {
  const cards = [
    {
      label: "Total Encaissé",
      value: `${stats.totalEncasse.toLocaleString()} F`,
      icon: Wallet,
      color: "emerald",
      trend: "+8% ce mois"
    },
    {
      label: "Créances Totales",
      value: `${stats.totalCreances.toLocaleString()} F`,
      icon: AlertCircle,
      color: "rose",
      trend: "-12% vs 2024"
    },
    {
      label: "Taux de Recouvrement",
      value: `${stats.tauxRecouvrement}%`,
      icon: TrendingUp,
      color: "blue",
      progress: stats.tauxRecouvrement
    },
    {
      label: "Versements du Jour",
      value: stats.paiementsDuJour.toString(),
      icon: CheckCircle2,
      color: "amber",
      trend: "Aujourd'hui"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card, i) => (
        <motion.div 
          key={i} 
          variants={item}
          className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1"
        >
          {/* Background Glow */}
          <div className={cn(
            "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 blur-3xl transition-opacity group-hover:opacity-20",
            card.color === "emerald" && "bg-emerald-500",
            card.color === "rose" && "bg-rose-500",
            card.color === "blue" && "bg-blue-500",
            card.color === "amber" && "bg-amber-500",
          )} />

          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {card.label}
              </p>
              {isLoading ? (
                <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
              ) : (
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </h3>
              )}
            </div>
            <div className={cn(
              "p-3 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3",
              card.color === "emerald" && "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
              card.color === "rose" && "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
              card.color === "blue" && "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
              card.color === "amber" && "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
            )}>
              <card.icon size={22} strokeWidth={2.5} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {card.trend && (
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full ring-1",
                card.color === "emerald" && "text-emerald-600 bg-emerald-50 ring-emerald-500/10",
                card.color === "rose" && "text-rose-600 bg-rose-50 ring-rose-500/10",
                card.color === "blue" && "text-blue-600 bg-blue-50 ring-blue-500/10",
                card.color === "amber" && "text-amber-600 bg-amber-50 ring-amber-500/10",
              )}>
                {card.trend}
              </span>
            )}
            {card.progress !== undefined && (
              <div className="flex-1 ml-4 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

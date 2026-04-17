"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/authStore";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { RecentEnrollments } from "@/features/dashboard/components/RecentEnrollments";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export default function Home() {
  const { user, hasHydrated } = useAuthStore();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: DashboardService.getStats,
    enabled: hasHydrated,
  });

  if (!hasHydrated) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse border-2 border-slate-200 dark:border-slate-800" />
      <p className="text-sm font-black uppercase tracking-widest text-slate-400">Chargement de votre session...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto overflow-y-auto flex-1 scrollbar-none"
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 w-fit">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.1em]">Vue d'ensemble — Année Scolaire 2025-2026</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Bienvenue, <span className="text-emerald-600">M. {user?.nom || "Admin"}</span> 
          </h1>
          <p className="text-slate-500 font-medium max-w-xl">
            Voici les indicateurs clés et les activités récentes de votre établissement pour aujourd'hui.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="h-12 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Serveur API : Connecté</span>
              <ShieldCheck size={16} className="text-emerald-500" />
           </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <DashboardStats stats={stats} isLoading={isLoading} />

      {/* Main Grid: Enrollments & Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Enrollments (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <RecentEnrollments 
            inscriptions={stats?.inscriptionsRecentes || []} 
            isLoading={isLoading} 
          />

          {/* Finance Pulse Visual */}
          <div className="rounded-3xl bg-slate-900 dark:bg-emerald-950/20 p-8 text-white relative overflow-hidden group border border-emerald-500/10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Objectif Recouvrement</span>
                </div>
                <h3 className="text-2xl font-black">État des Budgets</h3>
                <p className="text-slate-400 text-sm max-w-sm">Le taux de recouvrement global est en hausse de 5.2% par rapport à l'année dernière.</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-4xl font-black italic">{stats?.tauxPaiement || 0}%</div>
                <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.tauxPaiement || 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                </div>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>

        {/* Quick Actions (1/3) */}
        <div className="space-y-6">
          <QuickActions />
        </div>

      </div>
    </motion.div>
  );
}


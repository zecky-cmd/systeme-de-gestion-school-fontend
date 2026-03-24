"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/authStore";
import { Users, GraduationCap, TrendingUp, BookOpen } from "lucide-react";


export default function Home() {
  const { hasHydrated } = useAuthStore();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: DashboardService.getStats,
    enabled: hasHydrated, // Ne pas lancer la requête avant l'hydratation du store
  });

  if (!hasHydrated) return <div className="p-8 text-center text-muted-foreground animate-pulse">Chargement de votre session...</div>;


  const cards = [
    { 
      label: "Effectif total", 
      value: stats?.totalEleves || "0", 
      icon: Users,
      trend: "+12% ce mois"
    },
    { 
      label: "Total classes", 
      value: stats?.totalClasses || "0", 
      icon: GraduationCap,
      trend: "Stable"
    },
    { 
      label: "Taux de paiement", 
      value: `${stats?.tauxPaiement || 0}%`, 
      icon: TrendingUp,
      trend: "+5% vs 2024"
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tableau de bord" 
        subtitle="Vue d'ensemble de l'établissement — Année 2025-2026"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                {isLoading ? (
                  <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg mt-2" />
                ) : (
                  <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{card.value}</p>
                )}
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <card.icon size={20} />
              </div>
            </div>
            {!isLoading && (
              <div className="mt-4 flex items-center gap-1.5">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                  {card.trend}
                </span>
                <span className="text-xs text-slate-400">vs année précédente</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center justify-center text-center">
          <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Emploi du temps global</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-xs">Visualisez et gérez les plannings de toutes les classes sur une seule vue.</p>
        </div>
        <div className="h-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center justify-center text-center">
          <TrendingUp className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Suivi des paiements</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-xs">Analyse graphique des entrées financières et des impayés par niveau.</p>
        </div>
      </div>
    </div>
  );
}


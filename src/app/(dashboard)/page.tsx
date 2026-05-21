"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/authStore";

import { RecentEnrollments } from "@/features/dashboard/components/RecentEnrollments";
import { PageHeader } from "@/components/shared/PageHeader";

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

      <PageHeader 
      title={<>Bienvenue, <span className="text-emerald-600">M. {user?.nom || "Admin"}</span> </>}
      subtitle="Voici les indicateurs clés et les activités récentes de votre établissement pour aujourd'hui."
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Enrollments (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <RecentEnrollments 
            inscriptions={stats?.inscriptionsRecentes || []} 
            isLoading={isLoading} 
          />
        </div>

        {/* Quick Actions (1/3) */}
        <div className="space-y-6">
        </div>

      </div>
    </motion.div>
  );
}
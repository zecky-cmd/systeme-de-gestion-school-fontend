"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnseignantStatsProps {
  stats: {
    total: number;
    vacataires: number;
    permanents: number;
    matieresCouvertes: number;
  };
  isLoading?: boolean;
}

export function EnseignantsStats({ stats, isLoading }: EnseignantStatsProps) {
  const items = [
    {
      label: "Total Enseignants",
      value: stats.total,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Vacataires",
      value: stats.vacataires,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Permanents",
      value: stats.permanents,
      icon: UserCheck,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Matières Couvertes",
      value: stats.matieresCouvertes,
      icon: BookOpen,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map((item, index) => (
        <Card key={index} className="border-none shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.05] overflow-hidden group hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300",
                item.bg
              )}>
                <item.icon className={cn("h-6 w-6", item.color)} />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {isLoading ? "..." : item.value}
                  </h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

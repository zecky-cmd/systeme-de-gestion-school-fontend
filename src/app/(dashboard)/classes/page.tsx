"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClasseService } from "@/services/classe.service";
import { ConfigService } from "@/services/config.service";
import { ClasseStats } from "@/features/classes/components/ClasseStats";
import { ClassesTable } from "@/features/classes/components/ClassesTable";
import { AddClasseSheet } from "@/features/classes/components/AddClasseSheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  LayoutGrid
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export default function ClassesPage() {
  const [search, setSearch] = useState("");
  const [cycleFilter, setCycleFilter] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // 1. Récupérer la configuration active
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: () => ConfigService.getConfig(),
  });

  // 2. Récupérer les classes (filtrées par année scolaire)
  const { data: classes = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["classes", config?.anneeActiveId],
    queryFn: () => ClasseService.getAll(config?.anneeActiveId),
    enabled: !!config?.anneeActiveId,
  });

  // 3. Calculer les statistiques localement basées sur les données réelles
  const stats = useMemo(() => {
    const totalClasses = classes.length;
    const totalEleves = classes.reduce((acc, curr) => acc + (curr.totalInscrits || 0), 0);
    const moyenneParClasse = totalClasses > 0 ? totalEleves / totalClasses : 0;
    const classesSurcharge = classes.filter(c => (c.totalInscrits || 0) > (c.capaciteMax || 40)).length;

    return { totalClasses, totalEleves, moyenneParClasse, classesSurcharge };
  }, [classes]);

  // 4. Filtrage côté client
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const matchSearch = c.nom.toLowerCase().includes(search.toLowerCase()) || 
                          c.niveau.toLowerCase().includes(search.toLowerCase());
      const matchCycle = cycleFilter === "all" || c.cycle === cycleFilter;
      return matchSearch && matchCycle;
    });
  }, [classes, search, cycleFilter]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <LayoutGrid size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gestion Académique</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Organisation des <span className="text-emerald-600">Classes</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 max-w-md">
            Gérez les sections, surveillez le remplissage et optimisez l'affectation des élèves par cycle et niveau.
          </p>
        </div>

        <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="h-9 px-3 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
              disabled={isFetching}
            >
              <RefreshCw className={isFetching ? "animate-spin h-3.5 w-3.5" : "h-3.5 w-3.5"} />
            </Button>
            <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-2 text-xs font-black border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
            >
                <Download size={14} />
                EXPORTER
            </Button>
            <Button 
              onClick={() => setIsAddOpen(true)}
              className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 gap-2 border-0"
            >
              <Plus size={16} strokeWidth={3} />
              NOUVELLE CLASSE
            </Button>
        </div>
      </div>

      {/* Statistiques Dynamiques */}
      <ClasseStats stats={stats} isLoading={isLoading} />

      {/* Barre de Filtres Contextuelle */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 backdrop-blur-md shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            placeholder="Rechercher une classe ou un niveau..." 
            className="pl-10 h-10 bg-transparent border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20 font-bold text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <Select value={cycleFilter} onValueChange={(val) => setCycleFilter(val || "all")}>
              <SelectTrigger className="w-[140px] h-10 font-bold border-slate-200 dark:border-slate-800 bg-transparent">
                <SelectValue placeholder="Tous les cycles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les cycles</SelectItem>
                <SelectItem value="col">Collège</SelectItem>
                <SelectItem value="lyc">Lycée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400">
             <LayoutGrid size={18} />
          </Button>
        </div>
      </div>

      {/* Tableau des Classes */}
      <AnimatePresence mode="wait">
        <motion.div
           key={cycleFilter + search}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.2 }}
        >
           <ClassesTable 
              classes={filteredClasses} 
              isLoading={isLoading} 
           />
        </motion.div>
      </AnimatePresence>

      {/* Sheet d'ajout */}
      <AddClasseSheet 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
      />
    </motion.div>
  );
}

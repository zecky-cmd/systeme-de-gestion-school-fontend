"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Classe, ClasseService } from "@/services/classe.service";
import { ConfigService } from "@/services/config.service";
import { ClasseStats } from "@/features/classes/components/ClasseStats";
import { ClassesTable } from "@/features/classes/components/ClassesTable";
import { ClasseFormSheet } from "@/features/classes/components/ClasseFormSheet";
import { motion, AnimatePresence } from "framer-motion";
import { ClassesHeader } from "@/features/classes/components/sub-components/ClassesHeader";
import { ClassesFilters } from "@/features/classes/components/sub-components/ClassesFilters";

export default function ClassesPage() {
  const [search, setSearch] = useState("");
  const [cycleFilter, setCycleFilter] = useState<string>("all");
  
  // États pour le volet de formulaire
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit" | "view">("add");
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);

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

  // Handlers pour les actions
  const handleAdd = () => {
    setSheetMode("add");
    setSelectedClasse(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (classe: Classe) => {
    setSheetMode("edit");
    setSelectedClasse(classe);
    setIsSheetOpen(true);
  };

  const handleView = (classe: Classe) => {
    setSheetMode("view");
    setSelectedClasse(classe);
    setIsSheetOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto overflow-y-auto flex-1"
    >
      <ClassesHeader 
        onAdd={handleAdd} 
        onRefresh={() => refetch()} 
        isFetching={isFetching} 
      />

      <ClasseStats stats={stats} isLoading={isLoading} />

      <ClassesFilters 
        search={search} 
        onSearchChange={setSearch} 
        cycleFilter={cycleFilter} 
        onCycleChange={setCycleFilter} 
      />

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
              onEdit={handleEdit}
              onView={handleView}
           />
        </motion.div>
      </AnimatePresence>

      <ClasseFormSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen}
        mode={sheetMode}
        initialData={selectedClasse}
      />
    </motion.div>
  );
}

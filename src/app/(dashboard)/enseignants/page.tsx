"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { EnseignantService, Enseignant } from "@/services/enseignant.service";
import { EnseignantsStats } from "@/features/enseignants/components/EnseignantsStats";
import { EnseignantsTable } from "@/features/enseignants/components/EnseignantsTable";
import { EnseignantFormSheet } from "@/features/enseignants/components/EnseignantFormSheet";
import { PageHeader } from "@/components/shared/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";

export default function EnseignantsPage() {
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit" | "view">("add");
  const [selectedEnseignant, setSelectedEnseignant] = useState<Enseignant | null>(null);

  // 1. Récupérer les enseignants
  const { data: enseignants = [], isLoading } = useQuery({
    queryKey: ["enseignants"],
    queryFn: () => EnseignantService.getAll(),
  });

  // 2. Calculer les statistiques
  const stats = useMemo(() => {
    const total = enseignants.length;
    const actifs = enseignants.filter(e => e.statut === "actif").length;
    const inactifs = enseignants.filter(e => e.statut === "inact").length;
    
    // Compter les spécialités uniques
    const specialitesSet = new Set(enseignants.map(e => e.specialite).filter(Boolean));
    
    return { 
      total, 
      actifs, 
      inactifs, 
      specialites: specialitesSet.size 
    };
  }, [enseignants]);

  // 3. Filtrage côté client
  const filteredEnseignants = useMemo(() => {
    return enseignants.filter((e) => {
      const searchStr = `${e.user?.nom} ${e.user?.prenom} ${e.matricule} ${e.specialite}`.toLowerCase();
      return searchStr.includes(search.toLowerCase());
    });
  }, [enseignants, search]);

  // Handlers
  const handleAdd = () => {
    setSheetMode("add");
    setSelectedEnseignant(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (enseignant: Enseignant) => {
    setSheetMode("edit");
    setSelectedEnseignant(enseignant);
    setIsSheetOpen(true);
  };

  const handleView = (enseignant: Enseignant) => {
    setSheetMode("view");
    setSelectedEnseignant(enseignant);
    setIsSheetOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto overflow-y-auto flex-1 scrollbar-none"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          title="Corps Professoral" 
          subtitle="Gestion des enseignants, de leurs spécialités et de leur statut."
        />
        <Button 
          onClick={handleAdd}
          className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest h-12 px-8 shadow-xl shadow-emerald-500/20 group transition-all"
        >
          <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
          Ajouter un enseignant
        </Button>
      </div>

      <EnseignantsStats stats={stats} isLoading={isLoading} />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto bg-white dark:bg-slate-950 p-1.5 pl-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all flex-1 md:max-w-md">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <Input 
            placeholder="Rechercher par nom, matricule ou spécialité..." 
            className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-9 font-bold text-sm placeholder:text-slate-400 placeholder:font-medium p-0 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={search}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
        >
           <EnseignantsTable 
              enseignants={filteredEnseignants} 
              isLoading={isLoading} 
              onEdit={handleEdit}
              onView={handleView}
           />
        </motion.div>
      </AnimatePresence>

      <EnseignantFormSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen}
        mode={sheetMode}
        initialData={selectedEnseignant}
      />
    </motion.div>
  );
}

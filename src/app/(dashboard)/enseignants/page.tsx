"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { EnseignantService, Enseignant } from "@/services/enseignant.service";
import { EnseignantsStats } from "@/features/enseignants/components/EnseignantsStats";
import { EnseignantsTable } from "@/features/enseignants/components/EnseignantsTable";
import { EnseignantsByMatiere } from "@/features/enseignants/components/EnseignantsByMatiere";
import { EnseignantFormSheet } from "@/features/enseignants/components/EnseignantFormSheet";
import { PageHeader } from "@/components/shared/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Search, Users, BookOpen, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type TabView = "liste" | "matiere";

export default function EnseignantsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabView>("liste");
  const [filterType, setFilterType] = useState<string>("tous");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit" | "view">("add");
  const [selectedEnseignant, setSelectedEnseignant] = useState<Enseignant | null>(null);

  // Récupérer les enseignants
  const { data: enseignants = [], isLoading } = useQuery({
    queryKey: ["enseignants"],
    queryFn: () => EnseignantService.getAll(),
  });

  // Récupérer les stats par matière
  const { data: matiereStats = [], isLoading: isLoadingMatieres } = useQuery({
    queryKey: ["enseignants-stats-matieres"],
    queryFn: () => EnseignantService.getStatsByMatiere(),
    enabled: activeTab === "matiere",
  });

  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = enseignants.length;
    const vacataires = enseignants.filter(e => e.typeContrat === "vacataire").length;
    const permanents = enseignants.filter(e => e.typeContrat === "permanent").length;
    
    // Compter les matières uniques
    const matiereSet = new Set(enseignants.flatMap(e => e.matieres || []).filter(Boolean));
    
    return { 
      total, 
      vacataires, 
      permanents, 
      matieresCouvertes: matiereSet.size 
    };
  }, [enseignants]);

  // Filtrage côté client
  const filteredEnseignants = useMemo(() => {
    return enseignants.filter((e) => {
      // Filtre texte
      const searchStr = `${e.user?.nom} ${e.user?.prenom} ${e.matricule} ${e.matieres?.join(" ")}`.toLowerCase();
      const matchesSearch = searchStr.includes(search.toLowerCase());

      // Filtre type contrat
      const matchesType = filterType === "tous" || e.typeContrat === filterType;

      return matchesSearch && matchesType;
    });
  }, [enseignants, search, filterType]);

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

  const tabs = [
    { id: "liste" as TabView, label: "Liste des enseignants", icon: Users },
    { id: "matiere" as TabView, label: "Par matière", icon: BookOpen },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto overflow-y-auto flex-1 scrollbar-none"
    >
      <PageHeader
        title={<>Corps <span className="text-emerald-600">Professoral</span></>}
        subtitle="Gestion des enseignants, de leurs spécialités et de leur statut."
        actionButton={{
          label: "AJOUTER UN ENSEIGNANT",
          onClick: handleAdd,
        }}
      />

      {/* Stats */}
      <EnseignantsStats stats={stats} isLoading={isLoading} />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
              activeTab === tab.id
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar (only for Liste view) */}
      {activeTab === "liste" && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto bg-white dark:bg-slate-950 p-1.5 pl-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all flex-1 md:max-w-sm">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <Input 
              placeholder="Rechercher un enseignant..." 
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-9 font-bold text-sm placeholder:text-slate-400 placeholder:font-medium p-0 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Select value={filterType} onValueChange={(val) => val && setFilterType(val)}>
              <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
                <SelectItem value="vacataire">Vacataire</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-xl h-10 font-bold text-sm gap-2 border-slate-200 dark:border-slate-800">
              <Download size={16} />
              Exporter
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "liste" ? (
          <motion.div
            key="liste"
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
        ) : (
          <motion.div
            key="matiere"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <EnseignantsByMatiere 
              matiereStats={matiereStats} 
              isLoading={isLoadingMatieres} 
            />
          </motion.div>
        )}
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

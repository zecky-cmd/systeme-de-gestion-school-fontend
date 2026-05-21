"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EnseignantsTable } from "./EnseignantsTable";
import { EnseignantsByMatiere } from "./EnseignantsByMatiere";
import { EnseignantsToolbar } from "./EnseignantsToolbar";
import type { Enseignant, MatiereStats } from "@/services/enseignant.service";
import type { EnseignantsTabView } from "@/features/enseignants/constants/enseignants-list.constants";

interface EnseignantsTabContentProps {
  activeTab: EnseignantsTabView;
  search: string;
  filterType: string;
  onSearchChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  filteredEnseignants: Enseignant[];
  isLoading: boolean;
  matiereStats: MatiereStats[];
  isLoadingMatieres: boolean;
  onEdit: (enseignant: Enseignant) => void;
  onView: (enseignant: Enseignant) => void;
}

export function EnseignantsTabContent({
  activeTab,
  search,
  filterType,
  onSearchChange,
  onFilterTypeChange,
  filteredEnseignants,
  isLoading,
  matiereStats,
  isLoadingMatieres,
  onEdit,
  onView,
}: EnseignantsTabContentProps) {
  return (
    <>
      {activeTab === "liste" && (
        <EnseignantsToolbar
          search={search}
          filterType={filterType}
          onSearchChange={onSearchChange}
          onFilterTypeChange={onFilterTypeChange}
        />
      )}

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
              onEdit={onEdit}
              onView={onView}
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
    </>
  );
}

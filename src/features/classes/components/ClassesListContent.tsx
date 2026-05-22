"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ClassesTable } from "./ClassesTable";
import type { Classe } from "@/services/classe.service";
import type { ClassesCycleFilter } from "@/features/classes/constants/classes-list.constants";

interface ClassesListContentProps {
  cycleFilter: ClassesCycleFilter;
  search: string;
  classes: Classe[];
  isLoading: boolean;
  onEdit: (classe: Classe) => void;
  onView: (classe: Classe) => void;
}

export function ClassesListContent({
  cycleFilter,
  search,
  classes,
  isLoading,
  onEdit,
  onView,
}: ClassesListContentProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={cycleFilter + search}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <ClassesTable
          classes={classes}
          isLoading={isLoading}
          onEdit={onEdit}
          onView={onView}
        />
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { EnseignantService, type Enseignant } from "@/services/enseignant.service";
import type { EnseignantsTabView } from "@/features/enseignants/constants/enseignants-list.constants";
import { filterEnseignants } from "@/features/enseignants/utils/filter-enseignants";
import { computeEnseignantStats } from "@/features/enseignants/utils/enseignant-display.utils";

export type EnseignantSheetMode = "add" | "edit" | "view";

function isForbiddenError(error: unknown): boolean {
  return (
    (error as { response?: { status?: number } })?.response?.status === 403
  );
}

export function useEnseignantsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<EnseignantsTabView>("liste");
  const [filterType, setFilterType] = useState("tous");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<EnseignantSheetMode>("add");
  const [selectedEnseignant, setSelectedEnseignant] =
    useState<Enseignant | null>(null);

  const {
    data: enseignants = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["enseignants"],
    queryFn: () => EnseignantService.getAll(),
  });

  const { data: matiereStats = [], isLoading: isLoadingMatieres } = useQuery({
    queryKey: ["enseignants-stats-matieres"],
    queryFn: () => EnseignantService.getStatsByMatiere(),
    enabled: activeTab === "matiere",
  });

  const stats = useMemo(
    () => computeEnseignantStats(enseignants),
    [enseignants]
  );

  const filteredEnseignants = useMemo(
    () => filterEnseignants(enseignants, { search, filterType }),
    [enseignants, search, filterType]
  );

  const openSheet = useCallback(
    (mode: EnseignantSheetMode, enseignant: Enseignant | null = null) => {
      setSheetMode(mode);
      setSelectedEnseignant(enseignant);
      setIsSheetOpen(true);
    },
    []
  );

  const handleAdd = useCallback(() => openSheet("add", null), [openSheet]);
  const handleEdit = useCallback(
    (enseignant: Enseignant) => openSheet("edit", enseignant),
    [openSheet]
  );
  const handleView = useCallback(
    (enseignant: Enseignant) => openSheet("view", enseignant),
    [openSheet]
  );

  return {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    filterType,
    setFilterType,
    stats,
    filteredEnseignants,
    isLoading,
    error,
    isForbidden: !!error && isForbiddenError(error),
    matiereStats,
    isLoadingMatieres,
    sheet: {
      open: isSheetOpen,
      setOpen: setIsSheetOpen,
      mode: sheetMode,
      selected: selectedEnseignant,
    },
    handlers: {
      handleAdd,
      handleEdit,
      handleView,
    },
  };
}

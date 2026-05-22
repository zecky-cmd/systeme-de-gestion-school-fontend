"use client";

import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClasseService, type Classe } from "@/services/classe.service";
import { ConfigService } from "@/services/config.service";
import type { ClassesCycleFilter } from "@/features/classes/constants/classes-list.constants";
import { filterClasses } from "@/features/classes/utils/filter-classes";
import { computeClasseStats } from "@/features/classes/utils/classe-display.utils";

export type ClasseSheetMode = "add" | "edit" | "view";

function isForbiddenError(error: unknown): boolean {
  return (
    (error as { response?: { status?: number } })?.response?.status === 403
  );
}

export function useClassesPage() {
  const [search, setSearch] = useState("");
  const [cycleFilter, setCycleFilter] = useState<ClassesCycleFilter>("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<ClasseSheetMode>("add");
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);

  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: ConfigService.getConfig,
  });

  const {
    data: classes = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["classes", config?.anneeActiveId],
    queryFn: () => ClasseService.getAll(config!.anneeActiveId),
    enabled: !!config?.anneeActiveId,
  });

  const stats = useMemo(() => computeClasseStats(classes), [classes]);

  const filteredClasses = useMemo(
    () => filterClasses(classes, { search, cycleFilter }),
    [classes, search, cycleFilter]
  );

  const openSheet = useCallback(
    (mode: ClasseSheetMode, classe: Classe | null = null) => {
      setSheetMode(mode);
      setSelectedClasse(classe);
      setIsSheetOpen(true);
    },
    []
  );

  const handleAdd = useCallback(() => openSheet("add", null), [openSheet]);
  const handleEdit = useCallback(
    (classe: Classe) => openSheet("edit", classe),
    [openSheet]
  );
  const handleView = useCallback(
    (classe: Classe) => openSheet("view", classe),
    [openSheet]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleExport = useCallback(() => {}, []);

  return {
    search,
    setSearch,
    cycleFilter,
    setCycleFilter,
    stats,
    filteredClasses,
    isLoading,
    error,
    isForbidden: !!error && isForbiddenError(error),
    isFetching,
    sheet: {
      open: isSheetOpen,
      setOpen: setIsSheetOpen,
      mode: sheetMode,
      selected: selectedClasse,
    },
    handlers: {
      handleAdd,
      handleEdit,
      handleView,
      handleRefresh,
      handleExport,
    },
  };
}

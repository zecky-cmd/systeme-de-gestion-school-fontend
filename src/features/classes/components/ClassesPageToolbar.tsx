"use client";

import { ClassesCycleTabs } from "./ClassesCycleTabs";
import { ClassesFilters } from "./sub-components/ClassesFilters";
import type { ClassesCycleFilter } from "@/features/classes/constants/classes-list.constants";

interface ClassesPageToolbarProps {
  search: string;
  cycleFilter: ClassesCycleFilter;
  onSearchChange: (value: string) => void;
  onCycleChange: (value: ClassesCycleFilter) => void;
}

export function ClassesPageToolbar({
  search,
  cycleFilter,
  onSearchChange,
  onCycleChange,
}: ClassesPageToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <ClassesCycleTabs
        cycleFilter={cycleFilter}
        onCycleChange={onCycleChange}
      />
      <div className="w-full md:w-auto flex-1 md:max-w-md">
        <ClassesFilters search={search} onSearchChange={onSearchChange} />
      </div>
    </div>
  );
}

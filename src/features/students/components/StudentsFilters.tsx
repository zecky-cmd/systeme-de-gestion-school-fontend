"use client";

import { ActionToolbar } from "@/components/shared/ActionToolbar";
import { STUDENT_STATUS_FILTER_OPTIONS } from "@/features/students/constants/students-list.constants";

interface ClassFilterOption {
  value: string;
  label: string;
}

interface StudentsFiltersProps {
  classOptions: ClassFilterOption[];
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
}

export function StudentsFilters({
  classOptions,
  onSearchChange,
  onFilterChange,
}: StudentsFiltersProps) {
  return (
    <ActionToolbar
      searchPlaceholder="Rechercher par nom, matricule..."
      onSearchChange={onSearchChange}
      onFilterChange={onFilterChange}
      filters={[
        {
          key: "classe",
          placeholder: "Toutes les classes",
          options: classOptions,
        },
        {
          key: "statut",
          placeholder: "Tout statut",
          options: [...STUDENT_STATUS_FILTER_OPTIONS],
        },
      ]}
    />
  );
}

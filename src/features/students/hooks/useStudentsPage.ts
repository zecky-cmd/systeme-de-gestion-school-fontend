"use client";

import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { StudentService, type Eleve } from "@/services/student.service";
import { ClasseService } from "@/services/classe.service";
import { ConfigService } from "@/services/config.service";
import { useAuthStore } from "@/store/authStore";
import { canPerform, type UserRole } from "@/constants/permissions";
import { filterStudents } from "@/features/students/utils/filter-students";
import { STUDENTS_ITEMS_PER_PAGE } from "@/features/students/constants/students-list.constants";

function isForbiddenError(error: unknown): boolean {
  return (
    (error as { response?: { status?: number } })?.response?.status === 403
  );
}

export function useStudentsPage() {
  const { hasHydrated, user } = useAuthStore();

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Eleve | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const role = user?.role as UserRole | undefined;

  const permissions = useMemo(
    () => ({
      canAdd: role ? canPerform(role, "CREATE_STUDENT") : false,
      canEdit: role ? canPerform(role, "EDIT_STUDENT") : false,
      canDelete: role ? canPerform(role, "DELETE_STUDENT") : false,
    }),
    [role]
  );

  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: ConfigService.getConfig,
    enabled: hasHydrated,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ["classes", config?.anneeActiveId],
    queryFn: () => ClasseService.getAll(config!.anneeActiveId),
    enabled: hasHydrated && !!config?.anneeActiveId,
  });

  const {
    data: eleves = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["eleves"],
    queryFn: StudentService.getAll,
    enabled: hasHydrated,
  });

  const classOptions = useMemo(
    () =>
      classes.map((c) => ({
        value: c.id.toString(),
        label: c.nom,
      })),
    [classes]
  );

  const filteredEleves = useMemo(
    () =>
      filterStudents(eleves, {
        searchTerm,
        selectedClasse,
        selectedStatus,
      }),
    [eleves, searchTerm, selectedClasse, selectedStatus]
  );

  const paginatedEleves = useMemo(() => {
    const startIndex = (currentPage - 1) * STUDENTS_ITEMS_PER_PAGE;
    return filteredEleves.slice(
      startIndex,
      startIndex + STUDENTS_ITEMS_PER_PAGE
    );
  }, [filteredEleves, currentPage]);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchTerm(val);
      resetPage();
    },
    [resetPage]
  );

  const handleFilterChange = useCallback(
    (key: string, val: string) => {
      if (key === "classe") setSelectedClasse(val);
      if (key === "statut") setSelectedStatus(val);
      resetPage();
    },
    [resetPage]
  );

  const handleView = useCallback((student: Eleve) => {
    setSelectedStudent(student);
    setIsViewSheetOpen(true);
  }, []);

  const handleEdit = useCallback((student: Eleve) => {
    setSelectedStudent(student);
    setIsEditSheetOpen(true);
  }, []);

  const handleEditFromDetail = useCallback((student: Eleve) => {
    setIsViewSheetOpen(false);
    setSelectedStudent(student);
    setIsEditSheetOpen(true);
  }, []);

  const openAddSheet = useCallback(() => setIsAddSheetOpen(true), []);

  return {
    hasHydrated,
    isLoading,
    error,
    isForbidden: !!error && isForbiddenError(error),
    eleves: paginatedEleves,
    filteredCount: filteredEleves.length,
    pagination: {
      currentPage,
      itemsPerPage: STUDENTS_ITEMS_PER_PAGE,
      setCurrentPage,
    },
    filters: {
      classOptions,
      onSearchChange: handleSearchChange,
      onFilterChange: handleFilterChange,
    },
    permissions,
    sheets: {
      selectedStudent,
      isAddOpen: isAddSheetOpen,
      isViewOpen: isViewSheetOpen,
      isEditOpen: isEditSheetOpen,
      setAddOpen: setIsAddSheetOpen,
      setViewOpen: setIsViewSheetOpen,
      setEditOpen: setIsEditSheetOpen,
      onEditFromDetail: handleEditFromDetail,
    },
    handlers: {
      handleView,
      handleEdit,
      openAddSheet,
    },
  };
}

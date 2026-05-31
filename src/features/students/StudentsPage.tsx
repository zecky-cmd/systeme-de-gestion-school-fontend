"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { ForbiddenAccessCard } from "@/components/shared/ForbiddenAccessCard";
import { QueryErrorState } from "@/components/shared/QueryErrorState";
import { StudentsFilters } from "@/features/students/components/StudentsFilters";
import { StudentsTable } from "@/features/students/components/StudentsTable";
import { StudentSheets } from "@/features/students/components/StudentSheets";
import { useStudentsPage } from "@/features/students/hooks/useStudentsPage";
import { STUDENT_TABLE_COLUMN_COUNT } from "@/features/students/constants/students-list.constants";

export function StudentsPage() {
  const vm = useStudentsPage();

  if (!vm.hasHydrated) {
    return <TableSkeleton columns={STUDENT_TABLE_COLUMN_COUNT} rows={6} />;
  }

  if (vm.isForbidden) {
    return (
      <ForbiddenAccessCard message="Désolé, vous n'avez pas les permissions nécessaires pour consulter la liste des élèves. Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur." />
    );
  }

  if (vm.error) {
    return <QueryErrorState />;
  }

  return (
    <RoleGuard allowedRoles={["adm", "dir", "ens"]}>
      <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <PageHeader
          title={
            <>
              Gestion des <span className="text-emerald-600">Élèves</span>
            </>
          }
          subtitle="Consultez, ajoutez et gérez les fiches des élèves de l'établissement."
          actionButton={
            vm.permissions.canAdd
              ? {
                  label: "NOUVELLE INSCRIPTION",
                  onClick: vm.handlers.openAddSheet,
                }
              : undefined
          }
        />

        <StudentsFilters
          classOptions={vm.filters.classOptions}
          onSearchChange={vm.filters.onSearchChange}
          onFilterChange={vm.filters.onFilterChange}
        />

        {vm.isLoading ? (
          <TableSkeleton columns={STUDENT_TABLE_COLUMN_COUNT} rows={6} />
        ) : (
          <StudentsTable
            students={vm.eleves}
            currentPage={vm.pagination.currentPage}
            totalFiltered={vm.filteredCount}
            itemsPerPage={vm.pagination.itemsPerPage}
            onPageChange={vm.pagination.setCurrentPage}
            onView={vm.handlers.handleView}
            onEdit={vm.handlers.handleEdit}
            canEdit={vm.permissions.canEdit}
            canDelete={vm.permissions.canDelete}
          />
        )}
        {/* les options dans action */}
        <StudentSheets
          selectedStudent={vm.sheets.selectedStudent}
          isAddOpen={vm.sheets.isAddOpen}
          isViewOpen={vm.sheets.isViewOpen}
          isEditOpen={vm.sheets.isEditOpen}
          onAddOpenChange={vm.sheets.setAddOpen}
          onViewOpenChange={vm.sheets.setViewOpen}
          onEditOpenChange={vm.sheets.setEditOpen}
          onEditFromDetail={vm.sheets.onEditFromDetail}
        />
      </div>
    </RoleGuard>
  );
}

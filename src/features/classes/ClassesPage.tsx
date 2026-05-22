"use client";

import { motion } from "framer-motion";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/shared/PageHeader";
import { ForbiddenAccessCard } from "@/components/shared/ForbiddenAccessCard";
import { QueryErrorState } from "@/components/shared/QueryErrorState";
import { ClasseStats } from "@/features/classes/components/ClasseStats";
import { ClassesPageToolbar } from "@/features/classes/components/ClassesPageToolbar";
import { ClassesListContent } from "@/features/classes/components/ClassesListContent";
import { ClasseFormSheet } from "@/features/classes/components/ClasseFormSheet";
import { useClassesPage } from "@/features/classes/hooks/useClassesPage";

export function ClassesPage() {
  const vm = useClassesPage();

  if (vm.isForbidden) {
    return (
      <ForbiddenAccessCard message="Désolé, vous n'avez pas les permissions nécessaires pour consulter les classes. Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur." />
    );
  }

  if (vm.error) {
    return <QueryErrorState />;
  }

  return (
    <RoleGuard allowedRoles={["adm", "dir", "ens"]}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto overflow-y-auto flex-1 scrollbar-none"
      >
        <PageHeader
          title={
            <>
              Organisation des <span className="text-emerald-600">Classes</span>
            </>
          }
          subtitle="Gérez les sections, surveillez le remplissage et optimisez l'affectation des élèves par cycle et niveau."
          showRefresh
          onRefresh={vm.handlers.handleRefresh}
          isRefreshing={vm.isFetching}
          showExport
          onExport={vm.handlers.handleExport}
          actionButton={{
            label: "NOUVELLE CLASSE",
            onClick: vm.handlers.handleAdd,
          }}
        />

        <ClasseStats stats={vm.stats} isLoading={vm.isLoading} />

        <ClassesPageToolbar
          search={vm.search}
          cycleFilter={vm.cycleFilter}
          onSearchChange={vm.setSearch}
          onCycleChange={vm.setCycleFilter}
        />

        <ClassesListContent
          cycleFilter={vm.cycleFilter}
          search={vm.search}
          classes={vm.filteredClasses}
          isLoading={vm.isLoading}
          onEdit={vm.handlers.handleEdit}
          onView={vm.handlers.handleView}
        />

        <ClasseFormSheet
          open={vm.sheet.open}
          onOpenChange={vm.sheet.setOpen}
          mode={vm.sheet.mode}
          initialData={vm.sheet.selected}
        />
      </motion.div>
    </RoleGuard>
  );
}

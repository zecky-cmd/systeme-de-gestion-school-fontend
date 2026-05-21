"use client";

import { motion } from "framer-motion";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/shared/PageHeader";
import { ForbiddenAccessCard } from "@/components/shared/ForbiddenAccessCard";
import { QueryErrorState } from "@/components/shared/QueryErrorState";
import { EnseignantsStats } from "@/features/enseignants/components/EnseignantsStats";
import { EnseignantsTabs } from "@/features/enseignants/components/EnseignantsTabs";
import { EnseignantsTabContent } from "@/features/enseignants/components/EnseignantsTabContent";
import { EnseignantFormSheet } from "@/features/enseignants/components/EnseignantFormSheet";
import { useEnseignantsPage } from "@/features/enseignants/hooks/useEnseignantsPage";

export function EnseignantsPage() {
  const vm = useEnseignantsPage();

  if (vm.isForbidden) {
    return (
      <ForbiddenAccessCard message="Désolé, vous n'avez pas les permissions nécessaires pour consulter les enseignants. Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur." />
    );
  }

  if (vm.error) {
    return <QueryErrorState />;
  }

  return (
    <RoleGuard allowedRoles={["adm", "dir"]}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto overflow-y-auto flex-1 scrollbar-none"
      >
        <PageHeader
          title={
            <>
              Corps <span className="text-emerald-600">Professoral</span>
            </>
          }
          subtitle="Gestion des enseignants, de leurs spécialités et de leur statut."
          actionButton={{
            label: "AJOUTER UN ENSEIGNANT",
            onClick: vm.handlers.handleAdd,
          }}
        />

        <EnseignantsStats stats={vm.stats} isLoading={vm.isLoading} />

        <EnseignantsTabs
          activeTab={vm.activeTab}
          onTabChange={vm.setActiveTab}
        />

        <EnseignantsTabContent
          activeTab={vm.activeTab}
          search={vm.search}
          filterType={vm.filterType}
          onSearchChange={vm.setSearch}
          onFilterTypeChange={vm.setFilterType}
          filteredEnseignants={vm.filteredEnseignants}
          isLoading={vm.isLoading}
          matiereStats={vm.matiereStats}
          isLoadingMatieres={vm.isLoadingMatieres}
          onEdit={vm.handlers.handleEdit}
          onView={vm.handlers.handleView}
        />

        <EnseignantFormSheet
          open={vm.sheet.open}
          onOpenChange={vm.sheet.setOpen}
          mode={vm.sheet.mode}
          initialData={vm.sheet.selected}
        />
      </motion.div>
    </RoleGuard>
  );
}

/**
 * FinanceView — Coordinateur
 *
 * Rôle unique : assembler les hooks et distribuer props + callbacks
 * vers les composants enfants. Zéro logique métier ici.
 *
 * Règle d'or : si tu ajoutes un `if`, un calcul ou un appel API
 * directement ici, c'est qu'il appartient à un hook.
 */

import React from "react";
import { useFinance }         from "../hooks/useFinance";
import { useFinanceState }    from "../hooks/useFinanceState";
import { useFinanceHandlers } from "../hooks/useFinanceHandlers";

import { CategoryTabs }  from "./finance/CategoryTabs";
import { CopyBar }       from "./finance/CopyBar";
import { RubricsTable }  from "./finance/RubricsTable";
import { WarningBanner } from "./finance/WarningBanner";
import { FinanceModals } from "./finance/FinanceModals";

// ─── Skeleton de chargement ──────────────────────────────────────────────────

function FinanceViewSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-xl w-[320px]" />
      <div className="border border-slate-100 shadow-sm p-6 space-y-4 rounded-2xl">
        <div className="h-6 bg-slate-200 rounded-lg w-1/4" />
        <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
        <div className="h-[200px] bg-slate-50 rounded-2xl w-full" />
      </div>
    </div>
  );
}

// ─── Coordinateur ────────────────────────────────────────────────────────────

export function FinanceView() {
  // 1. Données & mutations API
  const finance = useFinance();

  // 2. État UI (onglet actif, modals ouverts, item en cours de suppression…)
  const state = useFinanceState(finance.categories);

  // 3. Handlers métier (save, copy, delete) — dépendent des deux couches ci-dessus
  const handlers = useFinanceHandlers(finance, state);

  // ── Chargement ─────────────────────────────────────────────────────────────
  if (finance.isLoading || state.activeCategoryId === null) {
    return <FinanceViewSkeleton />;
  }

  // ── Données dérivées partagées entre plusieurs enfants ──────────────────────
  // (uniquement des lookups simples — pas de logique)
  const activeCategory   = finance.categories.find(c => c.id === state.activeCategoryId);
  const otherCategories  = finance.categories.filter(c => c.id !== state.activeCategoryId);

  // ── Rendu ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* Onglets de catégories + bouton "Ajouter une rubrique" */}
      <CategoryTabs
        categories={finance.categories}
        activeCategoryId={state.activeCategoryId}
        onSelectCategory={state.setActiveCategoryId}
        onDeleteCategory={(id, name) => state.openDeleteModal({ id, type: "category", name })}
        onOpenAddCategory={() => state.setIsCategoryModalOpen(true)}
        onOpenAddRubric={() => {
          state.setEditingRubric(null);
          state.setIsRubricModalOpen(true);
        }}
      />

      {/* Barre "Copier les tarifs vers…" — rendue uniquement s'il y a d'autres catégories */}
      {otherCategories.length > 0 && activeCategory && (
        <CopyBar
          otherCategories={otherCategories}
          onCopy={(targetCategory) => {
            state.setCopyTargetCategory(targetCategory);
            state.setIsCopyModalOpen(true);
          }}
        />
      )}

      {/* Grille rubriques × niveaux */}
      <RubricsTable
        rubrics={finance.rubrics}
        activeCategory={activeCategory}
        activeCategoryId={state.activeCategoryId}
        onEditRubric={(rubric) => {
          state.setEditingRubric(rubric);
          state.setIsRubricModalOpen(true);
        }}
        onDeleteRubric={(id, name) => state.openDeleteModal({ id, type: "rubric", name })}
        onAddRubric={() => {
          state.setEditingRubric(null);
          state.setIsRubricModalOpen(true);
        }}
      />

      {/* Avertissement paiements existants */}
      <WarningBanner />

      {/* Tous les modals montés ici — état géré dans useFinanceState */}
      <FinanceModals
        // États d'ouverture
        isRubricModalOpen={state.isRubricModalOpen}
        isCategoryModalOpen={state.isCategoryModalOpen}
        isCopyModalOpen={state.isCopyModalOpen}
        isDeleteConfirmOpen={state.isDeleteConfirmOpen}

        // Données nécessaires aux modals
        categories={finance.categories}
        anneeId={finance.anneeActiveId ?? 1}
        editingRubric={state.editingRubric}
        activeCategory={activeCategory ?? null}
        copyTargetCategory={state.copyTargetCategory}
        deletingItem={state.deletingItem}
        isDeleting={state.isDeleting}

        // Callbacks de fermeture
        onCloseRubric={() => {
          state.setIsRubricModalOpen(false);
          state.setEditingRubric(null);
        }}
        onCloseCategory={() => state.setIsCategoryModalOpen(false)}
        onCloseCopy={() => {
          state.setIsCopyModalOpen(false);
          state.setCopyTargetCategory(null);
        }}
        onCloseDelete={() => {
          state.setIsDeleteConfirmOpen(false);
          state.setDeletingItem(null);
        }}

        // Callbacks de confirmation (logique dans useFinanceHandlers)
        onSaveRubric={handlers.handleSaveRubric}
        onAddCategory={handlers.handleAddCategory}
        onConfirmCopy={handlers.handleCopyConfirm}
        onConfirmDelete={handlers.handleDeleteConfirm}
      />
    </div>
  );
}

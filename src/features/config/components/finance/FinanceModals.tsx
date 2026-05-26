import React from "react";
import { CategorieTarifaire, RubriqueFinanciere } from "@/services/finance.service";
import { DeletingItem } from "../../hooks/useFinanceState";

import { NewRubricModal } from "./modals/NewRubricModal";
import { NewCategoryModal } from "./modals/NewCategoryModal";
import { CopyReductionModal } from "./modals/CopyReductionModal";
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal";

interface FinanceModalsProps {
  // États d'ouverture
  isRubricModalOpen: boolean;
  isCategoryModalOpen: boolean;
  isCopyModalOpen: boolean;
  isDeleteConfirmOpen: boolean;

  // Données nécessaires aux modals
  categories: CategorieTarifaire[];
  anneeId: number;
  editingRubric: RubriqueFinanciere | null;
  activeCategory: CategorieTarifaire | null;
  copyTargetCategory: CategorieTarifaire | null;
  deletingItem: DeletingItem | null;
  isDeleting: boolean;

  // Callbacks de fermeture
  onCloseRubric: () => void;
  onCloseCategory: () => void;
  onCloseCopy: () => void;
  onCloseDelete: () => void;

  // Callbacks de confirmation
  onSaveRubric: (
    data: { 
      libelle: string; 
      estObligatoire: boolean; 
      tarifs: { 
        niveau: string; 
        categorieId: number; 
        montant: number }[] 
    }) => Promise<void>;
  onAddCategory: (data: { nom: string; description?: string }) => Promise<void>;
  onConfirmCopy: (reductionPercent: number) => Promise<void>;
  onConfirmDelete: () => Promise<void>;
}

export function FinanceModals({
  isRubricModalOpen,
  isCategoryModalOpen,
  isCopyModalOpen,
  isDeleteConfirmOpen,
  
  categories,
  anneeId,
  editingRubric,
  activeCategory,
  copyTargetCategory,
  deletingItem,
  isDeleting,

  onCloseRubric,
  onCloseCategory,
  onCloseCopy,
  onCloseDelete,

  onSaveRubric,
  onAddCategory,
  onConfirmCopy,
  onConfirmDelete
}: FinanceModalsProps) {
  return (
    <>
      {isRubricModalOpen && (
        <NewRubricModal
          isOpen={isRubricModalOpen}
          onClose={onCloseRubric}
          categories={categories}
          anneeId={anneeId}
          initialRubric={editingRubric}
          onSave={onSaveRubric}
        />
      )}

      {isCategoryModalOpen && (
        <NewCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={onCloseCategory}
          onAdd={onAddCategory}
        />
      )}

      {isCopyModalOpen && activeCategory && copyTargetCategory && (
        <CopyReductionModal
          isOpen={isCopyModalOpen}
          onClose={onCloseCopy}
          sourceCategoryName={activeCategory.nom}
          targetCategoryName={copyTargetCategory.nom}
          onConfirm={onConfirmCopy}
        />
      )}

      {isDeleteConfirmOpen && deletingItem && (
        <DeleteConfirmModal
          isOpen={isDeleteConfirmOpen}
          onClose={onCloseDelete}
          onConfirm={onConfirmDelete}
          isDeleting={isDeleting}
          title={deletingItem.type === "rubric" ? "Supprimer la rubrique" : "Supprimer la catégorie"}
          itemName={deletingItem.name}
          description={
            deletingItem.type === "rubric" 
              ? "Toutes les configurations tarifaires associées à cette rubrique sur les différents niveaux scolaires seront définitivement supprimées."
              : "Tous les tarifs configurés pour cette catégorie seront perdus."
          }
        />
      )}
    </>
  );
}

import { useState, useEffect } from "react";
import { CategorieTarifaire, RubriqueFinanciere } from "@/services/finance.service";

export interface DeletingItem {
  id: number;
  type: "rubric" | "category";
  name: string;
}

export function useFinanceState(categories: CategorieTarifaire[]) {
  // Navigation tabs state
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Modals state
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [editingRubric, setEditingRubric] = useState<RubriqueFinanciere | null>(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyTargetCategory, setCopyTargetCategory] = useState<CategorieTarifaire | null>(null);
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<DeletingItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Default active tab to the first category once loaded
  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      // Prefer "Non-Affecté" or first category
      const defaultCat = categories.find(c => c.nom.toLowerCase() === "non-affecté") || categories[0];
      setActiveCategoryId(defaultCat.id);
    }
  }, [categories, activeCategoryId]);

  const openDeleteModal = (item: DeletingItem) => {
    setDeletingItem(item);
    setIsDeleteConfirmOpen(true);
  };

  return {
    activeCategoryId,
    setActiveCategoryId,
    
    isRubricModalOpen,
    setIsRubricModalOpen,
    editingRubric,
    setEditingRubric,
    
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    
    isCopyModalOpen,
    setIsCopyModalOpen,
    copyTargetCategory,
    setCopyTargetCategory,
    
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    deletingItem,
    setDeletingItem,
    openDeleteModal,
    
    isDeleting,
    setIsDeleting,
  };
}

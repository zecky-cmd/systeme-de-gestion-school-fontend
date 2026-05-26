import { useFinance } from "./useFinance";
import { useFinanceState } from "./useFinanceState";

type FinanceData = ReturnType<typeof useFinance>;
type FinanceState = ReturnType<typeof useFinanceState>;

export function useFinanceHandlers(finance: FinanceData, state: FinanceState) {
  const {
    anneeActiveId,
    rubrics,
    categories,
    createCategory,
    deleteCategory,
    createRubric,
    updateRubric,
    deleteRubric,
    copyTariffs
  } = finance;

  const {
    activeCategoryId,
    setActiveCategoryId,
    editingRubric,
    copyTargetCategory,
    deletingItem,
    setIsDeleteConfirmOpen,
    setDeletingItem,
    setIsDeleting
  } = state;

  const handleSaveRubric = async (data: {
    libelle: string;
    estObligatoire: boolean;
    tarifs: { niveau: string; categorieId: number; montant: number }[];
  }) => {
    if (!anneeActiveId) return;

    if (editingRubric) {
      // Edit existing rubric
      await updateRubric(editingRubric.id, {
        libelle: data.libelle,
        estObligatoire: data.estObligatoire,
        tarifs: data.tarifs
      });
    } else {
      // Create new rubric
      await createRubric({
        anneeId: anneeActiveId,
        libelle: data.libelle,
        cycle: "tous",
        estObligatoire: data.estObligatoire,
        ordre: rubrics.length + 1,
        tarifs: data.tarifs
      });
    }
  };

  const handleCopyConfirm = async (reductionPercent: number) => {
    if (!activeCategoryId || !copyTargetCategory) return;
    await copyTariffs({
      sourceCategorieId: activeCategoryId,
      destinationCategorieId: copyTargetCategory.id,
      pourcentageReduction: reductionPercent
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      if (deletingItem.type === "rubric") {
        await deleteRubric(deletingItem.id);
      } else {
        await deleteCategory(deletingItem.id);
        // Switch to default category
        const remaining = categories.filter(c => c.id !== deletingItem.id);
        if (remaining.length > 0) {
          setActiveCategoryId(remaining[0].id);
        }
      }
      setIsDeleteConfirmOpen(false);
      setDeletingItem(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddCategory = async (data: { nom: string; description?: string }) => {
    await createCategory(data);
  };

  return {
    handleSaveRubric,
    handleCopyConfirm,
    handleDeleteConfirm,
    handleAddCategory
  };
}

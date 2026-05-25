import React, { useState } from "react";
import { Plus, Edit2, Trash2, AlertTriangle, Check, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFinance } from "../hooks/useFinance";
import { CategorieTarifaire, RubriqueFinanciere } from "@/services/finance.service";

// Modals
import { NewRubricModal } from "./finance/modals/NewRubricModal";
import { NewCategoryModal } from "./finance/modals/NewCategoryModal";
import { CopyReductionModal } from "./finance/modals/CopyReductionModal";
import { DeleteConfirmModal } from "./finance/modals/DeleteConfirmModal";

const LEVELS = ["6e", "5e", "4e", "3e", "2nde", "1ere", "Tle"];

export function FinanceView() {
  const {
    anneeActiveId,
    categories,
    rubrics,
    isLoading,
    createCategory,
    deleteCategory,
    createRubric,
    updateRubric,
    deleteRubric,
    copyTariffs
  } = useFinance();

  // Navigation tabs state
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Modals state
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [editingRubric, setEditingRubric] = useState<RubriqueFinanciere | null>(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyTargetCategory, setCopyTargetCategory] = useState<CategorieTarifaire | null>(null);
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{ id: number; type: "rubric" | "category"; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Default active tab to the first category once loaded
  React.useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      // Prefer "Non-Affecté" or first category
      const defaultCat = categories.find(c => c.nom.toLowerCase() === "non-affecté") || categories[0];
      setActiveCategoryId(defaultCat.id);
    }
  }, [categories, activeCategoryId]);

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  // Helper to extract fee amount for a rubric and level for the active category
  const getMontant = (rubric: RubriqueFinanciere, level: string) => {
    if (!activeCategoryId) return 0;
    const tarif = rubric.tarifs.find(t => t.niveau === level && t.categorieId === activeCategoryId);
    return tarif ? Number(tarif.montant) : 0;
  };

  // Helper to calculate total fees per level for active category
  const calculateTotal = (level: string) => {
    return rubrics.reduce((sum, rubric) => sum + getMontant(rubric, level), 0);
  };

  // Handlers
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

  if (isLoading || activeCategoryId === null) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-[320px]" />
        <Card className="border-slate-100 shadow-sm p-6 space-y-4">
          <div className="h-6 bg-slate-200 rounded-lg w-1/4" />
          <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
          <div className="h-[200px] bg-slate-50 rounded-2xl w-full" />
        </Card>
      </div>
    );
  }

  // Get other categories for the copy bar
  const otherCategories = categories.filter(c => c.id !== activeCategoryId);

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tabs & Tool Bar */}
      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Tabs List */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={cn(
                    "text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer",
                    isActive 
                      ? "bg-primary text-white shadow-sm" 
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  )}
                >
                  {cat.nom}
                  {/* Delete option for custom categories */}
                  {!["non-affecté", "affecté"].includes(cat.nom.toLowerCase()) && (
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingItem({ id: cat.id, type: "category", name: cat.nom });
                        setIsDeleteConfirmOpen(true);
                      }}
                      className="hover:bg-slate-300/50 p-0.5 rounded text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <X size={10} />
                    </span>
                  )}
                </button>
              );
            })}
            
            {/* Add Category Tab Button */}
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-xs font-semibold px-3 py-2 text-primary hover:bg-primary/5 hover:text-primary rounded-lg border border-dashed border-primary/20 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus size={12} /> Ajouter catégorie
            </button>
          </div>

          {/* Add Rubric Button */}
          <Button 
            onClick={() => {
              setEditingRubric(null);
              setIsRubricModalOpen(true);
            }}
            size="sm" 
            className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-4 gap-2 text-xs border-none shadow-md shadow-primary/10 transition-all cursor-pointer"
          >
            <Plus size={14} /> Ajouter une rubrique
          </Button>
        </div>

        {/* Copy fees tool bar */}
        {otherCategories.length > 0 && activeCategory && (
          <div className="rounded-xl bg-slate-100 border border-slate-200 p-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 shadow-sm/5">
            <span className="flex items-center gap-1.5">
              <Copy size={13} className="text-slate-400" />
              Copier les tarifs vers :
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {otherCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCopyTargetCategory(cat);
                    setIsCopyModalOpen(true);
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-sm cursor-pointer transition-colors text-[11px]"
                >
                  {cat.nom}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid Table */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 p-6 bg-slate-50/50 border-b border-slate-100">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Rubriques et tarifs - {activeCategory?.nom}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Configuration des frais pour les élèves en catégorie <span className="font-medium text-slate-700">"{activeCategory?.nom}"</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/40">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase py-4.5 px-6 w-[200px] text-slate-400">Rubrique</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-center w-[100px] text-slate-400">Oblig.</TableHead>
                  {LEVELS.map(level => (
                    <TableHead key={level} className="text-[10px] font-bold uppercase text-right pr-6 w-[90px] text-slate-400">{level}</TableHead>
                  ))}
                  <TableHead className="text-[10px] font-bold uppercase text-right pr-8 w-[90px] text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rubrics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={LEVELS.length + 3} className="text-center py-12 text-xs font-semibold text-slate-400">
                      Aucune rubrique financière configurée. Clickez sur "Ajouter une rubrique" pour commencer.
                    </TableCell>
                  </TableRow>
                ) : (
                  rubrics.map((rubric) => (

                    <TableRow key={rubric.id} className="border-slate-100 hover:bg-slate-50/30 transition-colors group">
                      <TableCell className="py-3 px-6 text-xs font-semibold text-slate-700">{rubric.libelle}</TableCell>
                      <TableCell className="text-center">
                        {rubric.estObligatoire ? (
                          <Check size={14} className="text-primary mx-auto stroke-[3]" />
                        ) : (
                          <X size={14} className="text-slate-300 mx-auto stroke-[2.5]" />
                        )}
                      </TableCell>
                      {LEVELS.map(level => (
                        <TableCell key={level} className="text-right pr-6">
                          <span className="text-xs font-semibold font-mono text-slate-600">
                            {getMontant(rubric, level)}
                          </span>
                        </TableCell>
                      ))}
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                            onClick={() => {
                              setEditingRubric(rubric);
                              setIsRubricModalOpen(true);
                            }}
                          >
                            <Edit2 size={12} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            onClick={() => {
                              setDeletingItem({ id: rubric.id, type: "rubric", name: rubric.libelle });
                              setIsDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                  ))
                )}
                
                {/* Total annuel Row */}
                {rubrics.length > 0 && (
                  <TableRow className="bg-primary/[0.03] hover:bg-primary/[0.03] border-t border-primary/10">
                    <TableCell className="py-4 px-6 text-xs font-bold text-primary uppercase tracking-wider">Total annuel</TableCell>
                    <TableCell />
                    {LEVELS.map(level => (
                      <TableCell key={level} className="text-right pr-6 text-xs font-bold text-primary font-mono tracking-tight">
                        {calculateTotal(level).toLocaleString()}
                      </TableCell>
                    ))}
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Warning Box */}
      <div className="rounded-2xl bg-amber-50/50 p-4 border border-amber-200/60 flex gap-3.5 items-start shadow-sm/5">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 font-medium leading-relaxed">
          Toute modification des tarifs ne s'appliquera qu'aux nouveaux encaissements. Les paiements déjà effectués ne seront pas affectés.
        </p>
      </div>

      {/* Modals Mounting */}
      {isRubricModalOpen && (
        <NewRubricModal
          isOpen={isRubricModalOpen}
          onClose={() => {
            setIsRubricModalOpen(false);
            setEditingRubric(null);
          }}
          categories={categories}
          anneeId={anneeActiveId || 1}
          initialRubric={editingRubric}
          onSave={handleSaveRubric}
        />
      )}

      {isCategoryModalOpen && (
        <NewCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onAdd={async (data) => {
            await createCategory(data);
          }}
        />
      )}

      {isCopyModalOpen && activeCategory && copyTargetCategory && (
        <CopyReductionModal
          isOpen={isCopyModalOpen}
          onClose={() => {
            setIsCopyModalOpen(false);
            setCopyTargetCategory(null);
          }}
          sourceCategoryName={activeCategory.nom}
          targetCategoryName={copyTargetCategory.nom}
          onConfirm={handleCopyConfirm}
        />
      )}

      {isDeleteConfirmOpen && deletingItem && (
        <DeleteConfirmModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => {
            setIsDeleteConfirmOpen(false);
            setDeletingItem(null);
          }}
          onConfirm={handleDeleteConfirm}
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
    </div>
  );
}

import React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CategorieTarifaire } from "@/services/finance.service";

interface CategoryTabsProps {
  categories: CategorieTarifaire[];
  activeCategoryId: number | null;
  onSelectCategory: (id: number) => void;
  onDeleteCategory: (id: number, name: string) => void;
  onOpenAddCategory: () => void;
  onOpenAddRubric: () => void;
}

export function CategoryTabs({
  categories,
  activeCategoryId,
  onSelectCategory,
  onDeleteCategory,
  onOpenAddCategory,
  onOpenAddRubric
}: CategoryTabsProps) {
  return (
    <div className="flex flex-col gap-4 shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Tabs List */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
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
                      onDeleteCategory(cat.id, cat.nom);
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
            onClick={onOpenAddCategory}
            className="text-xs font-semibold px-3 py-2 text-primary hover:bg-primary/5 hover:text-primary rounded-lg border border-dashed border-primary/20 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus size={12} /> Ajouter catégorie
          </button>
        </div>

        {/* Add Rubric Button */}
        <Button 
          onClick={onOpenAddRubric}
          size="sm" 
          className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-4 gap-2 text-xs border-none shadow-md shadow-primary/10 transition-all cursor-pointer"
        >
          <Plus size={14} /> Ajouter une rubrique
        </Button>
      </div>
    </div>
  );
}

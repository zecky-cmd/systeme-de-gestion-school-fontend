import React from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
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
import { CategorieTarifaire, RubriqueFinanciere } from "@/services/finance.service";

const LEVELS = ["6e", "5e", "4e", "3e", "2nde", "1ere", "Tle"];

interface RubricsTableProps {
  rubrics: RubriqueFinanciere[];
  activeCategory?: CategorieTarifaire | null;
  activeCategoryId: number | null;
  onEditRubric: (rubric: RubriqueFinanciere) => void;
  onDeleteRubric: (id: number, name: string) => void;
  onAddRubric: () => void;
}

export function RubricsTable({
  rubrics,
  activeCategory,
  activeCategoryId,
  onEditRubric,
  onDeleteRubric,
  onAddRubric
}: RubricsTableProps) {
  
  // Helpers
  const getMontant = (rubric: RubriqueFinanciere, level: string) => {
    if (!activeCategoryId) return 0;
    const tarif = rubric.tarifs?.find(t => t.niveau === level && t.categorieId === activeCategoryId);
    return tarif ? Number(tarif.montant) : 0;
  };

  const calculateTotal = (level: string) => {
    return rubrics.reduce((sum, rubric) => sum + getMontant(rubric, level), 0);
  };

  return (
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
                    Aucune rubrique financière configurée. Cliquez sur "Ajouter une rubrique" pour commencer.
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
                          onClick={() => onEditRubric(rubric)}
                        >
                          <Edit2 size={12} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          onClick={() => onDeleteRubric(rubric.id, rubric.libelle)}
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
  );
}

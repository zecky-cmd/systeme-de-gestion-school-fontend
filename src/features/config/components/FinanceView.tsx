import { Plus, Edit2, Trash2, AlertTriangle, Check, X } from "lucide-react";
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
import { FeeRubric } from "@/services/finance.service";

interface FinanceViewProps {
  fees: FeeRubric[];
  onUpdateFee: (id: number, level: string, price: number) => void;
}

const LEVELS = ["6eme", "5eme", "4eme", "3eme", "2nde", "1ere", "Tle"];

export function FinanceView({ fees, onUpdateFee }: FinanceViewProps) {
  // Calcul des totaux par niveau
  const calculateTotal = (level: string) => {
    return fees.reduce((sum, rubric) => sum + (rubric.prices[level] || 0), 0);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">Rubriques et tarifs</CardTitle>
            <CardDescription className="text-xs">Configuration des frais par rubrique et par niveau</CardDescription>
          </div>
          <Button size="sm" className="h-8 rounded-md bg-primary hover:bg-primary/90 text-white font-semibold px-4 gap-2 text-xs">
            <Plus size={14} /> Ajouter une rubrique
          </Button>
        </CardHeader>
        <CardContent className="p-0 border-t border-slate-100">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[10px] font-semibold uppercase py-3 px-6 w-[180px]">Rubrique</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase text-center w-[80px]">Oblig.</TableHead>
                  {LEVELS.map(level => (
                    <TableHead key={level} className="text-[10px] font-semibold uppercase text-right pr-6 w-[80px]">{level}</TableHead>
                  ))}
                  <TableHead className="text-[10px] font-semibold uppercase text-right pr-8 w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((rubric) => (
                  <TableRow key={rubric.id} className="border-slate-100 hover:bg-slate-50/30 transition-colors group">
                    <TableCell className="py-2.5 px-6 text-xs font-medium text-slate-700">{rubric.label}</TableCell>
                    <TableCell className="text-center">
                      {rubric.isMandatory ? (
                        <Check size={14} className="text-primary mx-auto" />
                      ) : (
                        <X size={14} className="text-slate-300 mx-auto" />
                      )}
                    </TableCell>
                    {LEVELS.map(level => (
                      <TableCell key={level} className="text-right pr-6">
                        <span className="text-xs font-mono text-slate-600">
                          {(rubric.prices[level] || 0).toLocaleString()}
                        </span>
                      </TableCell>
                    ))}
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded text-slate-400">
                          <Edit2 size={12} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded text-slate-400 hover:text-destructive">
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Ligne de Total */}
                <TableRow className="bg-primary/5 hover:bg-primary/5 border-t border-primary/10">
                  <TableCell className="py-4 px-6 text-xs font-bold text-primary uppercase tracking-tight">Total annuel</TableCell>
                  <TableCell />
                  {LEVELS.map(level => (
                    <TableCell key={level} className="text-right pr-6 text-xs font-bold text-primary font-mono">
                      {calculateTotal(level).toLocaleString()}
                    </TableCell>
                  ))}
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Warning Alert */}
      <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 flex gap-3 items-start">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
          Toute modification des tarifs ne s'appliquera qu'aux nouveaux encaissements. 
          Les paiements déjà effectués ne seront pas affectés.
        </p>
      </div>
    </div>
  );
}

import { Plus, Edit2, Trash2, Save } from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SubjectCoefficient } from "@/services/pedagogy.service";

interface SubjectsTableProps {
  subjects: SubjectCoefficient[];
  levels: string[];
  onAddClick: () => void;
  onSaveAll: () => void;
  onEditCoef: (subject: SubjectCoefficient) => void;
  onDeleteSubject: (subject: SubjectCoefficient) => void;
  isSaving: boolean;
}

export function SubjectsTable({
  subjects,
  levels,
  onAddClick,
  onSaveAll,
  onEditCoef,
  onDeleteSubject,
  isSaving
}: SubjectsTableProps) {
  return (
    <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-slate-900 font-heading">Coefficients des matières</CardTitle>
          <CardDescription className="text-sm">Définissez les matières et leurs coefficients par niveau</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={onAddClick}
            className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 rounded-xl"
          >
            <Plus size={18} />
            Ajouter une matière
          </Button>
          <Button 
            variant="outline"
            onClick={onSaveAll}
            disabled={isSaving}
            className="font-bold border-slate-200 hover:bg-slate-50 gap-2 rounded-xl h-10 px-6"
          >
            <Save size={18} className={cn(isSaving && "animate-spin")} />
            {isSaving ? "Enregistrement..." : "Enregistrer tout"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto overflow-y-visible">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="w-[200px] font-bold text-slate-900 px-6">Matière</TableHead>
                <TableHead className="w-[100px] font-bold text-slate-900">Groupe</TableHead>
                {levels.map(l => (
                  <TableHead key={l} className="text-center font-bold text-slate-900">{l}</TableHead>
                ))}
                <TableHead className="w-[120px] text-center font-bold text-slate-900 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                  <TableCell className="font-medium px-6">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-bold">{subject.matiere}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tight">{subject.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      {subject.groupe}
                    </span>
                  </TableCell>
                  {levels.map(level => (
                    <TableCell key={level} className="text-center">
                      <div className="flex justify-center">
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black transition-all",
                          (subject.coefficients?.[level] || 0) > 0 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "bg-slate-50 text-slate-300 border border-slate-100"
                        )}>
                          {subject.coefficients?.[level] || 0}
                        </div>
                      </div>
                    </TableCell>
                  ))}
                  <TableCell className="text-center px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onEditCoef(subject)}
                        title="Modifier les coefficients"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteSubject(subject)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

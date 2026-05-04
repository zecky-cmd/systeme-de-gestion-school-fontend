import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
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
import { SubjectCoefficient, NoteType } from "@/services/pedagogy.service";

interface PedagogyViewProps {
  subjects: SubjectCoefficient[];
  noteTypes: NoteType[];
  onUpdateCoefficients: (subjects: SubjectCoefficient[]) => void;
  onUpdateNoteTypes: (noteTypes: NoteType[]) => void;
  isSaving: boolean;
}

const LEVELS = ["6e", "5e", "4e", "3e", "2nde", "1ere", "Tle"];

const NOTE_TYPE_STYLES: Record<string, string> = {
  "DS": "bg-blue-50 border-blue-200 text-blue-700",
  "Interrogation": "bg-amber-50 border-amber-200 text-amber-700",
  "Composition": "bg-green-50 border-green-200 text-green-700",
  "Examen blanc": "bg-red-50 border-red-200 text-red-700",
};

export function PedagogyView({ 
  subjects: initialSubjects, 
  noteTypes: initialNoteTypes, 
  onUpdateCoefficients,
  onUpdateNoteTypes,
  isSaving 
}: PedagogyViewProps) {
  const [localSubjects, setLocalSubjects] = useState<SubjectCoefficient[]>(initialSubjects);
  const [localNoteTypes, setLocalNoteTypes] = useState<NoteType[]>(initialNoteTypes);

  useEffect(() => {
    setLocalSubjects(initialSubjects);
    setLocalNoteTypes(initialNoteTypes);
  }, [initialSubjects, initialNoteTypes]);

  const handleCoefClick = (subjectId: number, level: string) => {
    setLocalSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        const current = s.coefficients[level] || 0;
        const next = current === 0 ? 1 : current === 5 ? 0 : current + 1;
        return { ...s, coefficients: { ...s.coefficients, [level]: next } };
      }
      return s;
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Matières et coefficients */}
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold text-slate-900 font-heading">Matières et coefficients</CardTitle>
            <CardDescription className="text-xs">Configuration pédagogique conforme au programme MENA</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 rounded-md border-slate-200 text-xs font-semibold px-3 gap-1.5">
              <Plus size={14} /> Ajouter
            </Button>
            <Button 
              onClick={() => onUpdateCoefficients(localSubjects)}
              disabled={isSaving}
              size="sm" 
              className="h-8 rounded-md bg-primary hover:bg-primary/90 text-white font-semibold px-4 gap-2 text-xs shadow-sm transition-all active:scale-95"
            >
              <Save size={14} />
              {isSaving ? "..." : "Enregistrer"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 border-t border-slate-100">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[10px] font-semibold uppercase py-3 px-6 w-[180px]">Matière</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase text-center w-[60px]">Code</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase text-center w-[80px]">Groupe</TableHead>
                  {LEVELS.map(level => (
                    <TableHead key={level} className="text-[10px] font-semibold uppercase text-center w-[50px]">{level}</TableHead>
                  ))}
                  <TableHead className="text-[10px] font-semibold uppercase text-right pr-8 w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localSubjects.map((subject) => (
                  <TableRow key={subject.id} className="border-slate-100 hover:bg-slate-50/30 transition-colors group">
                    <TableCell className="py-2.5 px-6 text-xs font-medium text-slate-700">{subject.matiere}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-500 border border-slate-200">
                        {subject.code}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-[11px] text-slate-400">{subject.groupe}</TableCell>
                    {LEVELS.map(level => (
                      <TableCell key={level} className="text-center">
                        <div 
                          onClick={() => handleCoefClick(subject.id, level)}
                          className={cn(
                            "inline-flex items-center justify-center h-7 w-7 rounded text-xs font-semibold transition-all cursor-pointer select-none active:scale-90",
                            subject.coefficients[level] > 0 
                              ? "bg-primary/10 text-primary hover:bg-primary/20" 
                              : "bg-secondary text-muted-foreground hover:bg-slate-300"
                          )}
                        >
                          {subject.coefficients[level]}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded text-slate-400 hover:text-slate-900">
                          <Edit2 size={12} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded text-slate-400 hover:text-destructive">
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Types de notes */}
      <div className="space-y-3">
        <div className="px-1 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 font-heading">Types de notes</h3>
            <p className="text-xs text-muted-foreground">Définir les types d'évaluations et leur pondération par défaut</p>
          </div>
          <Button 
            onClick={() => onUpdateNoteTypes(localNoteTypes)}
            disabled={isSaving}
            size="sm" 
            className="h-8 rounded-md bg-primary hover:bg-primary/90 text-white font-semibold px-4 gap-2 text-xs shadow-sm transition-all active:scale-95"
          >
            <Save size={14} />
            {isSaving ? "..." : "Enregistrer les poids"}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {localNoteTypes.map((type) => (
            <div 
              key={type.id} 
              className={cn(
                "p-3 rounded-lg border transition-all duration-300 relative group",
                NOTE_TYPE_STYLES[type.label] || "bg-white border-slate-200 shadow-sm"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">{type.label}</span>
                <Edit2 size={12} className="opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-slate-500 hover:text-slate-900" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-bold opacity-60 uppercase">Poids:</span>
                  <span className="text-xs font-bold">x{type.weight}</span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setLocalNoteTypes(prev => prev.map(t => t.id === type.id ? { ...t, weight: Math.max(1, t.weight - 1) } : t))}
                    className="h-5 w-5 rounded bg-white/50 border border-black/5 flex items-center justify-center text-xs font-bold hover:bg-white"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => setLocalNoteTypes(prev => prev.map(t => t.id === type.id ? { ...t, weight: t.weight + 1 } : t))}
                    className="h-5 w-5 rounded bg-white/50 border border-black/5 flex items-center justify-center text-xs font-bold hover:bg-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

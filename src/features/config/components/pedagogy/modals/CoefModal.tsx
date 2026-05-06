import { Check } from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CoefStepper } from "../CoefStepper";
import { SubjectCoefficient } from "@/services/pedagogy.service";

interface CoefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  selectedSubject: SubjectCoefficient | null;
  levels: string[];
  onCoefChange: (id: number, level: string, value: number) => void;
}

export function CoefModal({
  isOpen,
  onClose,
  onSave,
  selectedSubject,
  levels,
  onCoefChange
}: CoefModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">Modifier les coefficients</DialogTitle>
          <DialogDescription className="text-slate-500">
            Coefficients de <span className="font-bold text-slate-900">{selectedSubject?.matiere} ({selectedSubject?.code})</span> par niveau
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-8 pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {levels.map(l => (
              <div key={l} className="flex flex-col items-center gap-2">
                <div className="text-xs font-bold text-slate-400">{l}</div>
                <div className="w-16">
                  <CoefStepper 
                    value={selectedSubject?.coefficients?.[l] || 0}
                    onChange={(v) => onCoefChange(selectedSubject!.id, l, v)}
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl px-8 font-bold">Annuler</Button>
            <Button onClick={onSave} className="bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl px-10 font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all active:scale-95">
              <Check size={18} /> Enregistrer
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AcademicYear } from "@/services/academic-year.service";

interface YearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedYear: Partial<AcademicYear> | null;
  onUpdateSelectedYear: (data: Partial<AcademicYear>) => void;
  onSave: () => void;
}

export function YearDialog({
  open,
  onOpenChange,
  selectedYear,
  onUpdateSelectedYear,
  onSave
}: YearDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedYear?.id ? "Modifier l'année scolaire" : "Nouvelle année scolaire"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="libelle">Libellé (ex: 2025-2026)</Label>
            <Input 
              id="libelle" 
              value={selectedYear?.libelle || ""} 
              onChange={(e) => onUpdateSelectedYear({ libelle: e.target.value })}
              placeholder="2025-2026"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dateDebut">Date début</Label>
              <Input 
                id="dateDebut" 
                type="date"
                value={selectedYear?.dateDebut?.split('T')[0] || ""} 
                onChange={(e) => onUpdateSelectedYear({ dateDebut: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dateFin">Date fin</Label>
              <Input 
                id="dateFin" 
                type="date"
                value={selectedYear?.dateFin?.split('T')[0] || ""} 
                onChange={(e) => onUpdateSelectedYear({ dateFin: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="modeEval">Mode d'évaluation</Label>
            <Select 
              value={selectedYear?.modeEval || "trim"}
              onValueChange={(v) => onUpdateSelectedYear({ modeEval: v as "trim" | "sem" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir le mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trim">Trimestriel (3 périodes)</SelectItem>
                <SelectItem value="sem">Semestriel (2 périodes)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={onSave}
            disabled={!selectedYear?.libelle || !selectedYear?.dateDebut || !selectedYear?.dateFin}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

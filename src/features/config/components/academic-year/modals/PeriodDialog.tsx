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
import { EvaluationPeriod } from "@/services/academic-year.service";

interface PeriodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPeriod: Partial<EvaluationPeriod> | null;
  onUpdateSelectedPeriod: (data: Partial<EvaluationPeriod>) => void;
  onSave: () => void;
}

export function PeriodDialog({
  open,
  onOpenChange,
  selectedPeriod,
  onUpdateSelectedPeriod,
  onSave
}: PeriodDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la période</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="p-libelle">Libellé</Label>
            <Input 
              id="p-libelle" 
              value={selectedPeriod?.libelle || ""} 
              onChange={(e) => onUpdateSelectedPeriod({ libelle: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="p-dateDebut">Date début</Label>
              <Input 
                id="p-dateDebut" 
                type="date"
                value={selectedPeriod?.dateDebut?.split('T')[0] || ""} 
                onChange={(e) => onUpdateSelectedPeriod({ dateDebut: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-dateFin">Date fin</Label>
              <Input 
                id="p-dateFin" 
                type="date"
                value={selectedPeriod?.dateFin?.split('T')[0] || ""} 
                onChange={(e) => onUpdateSelectedPeriod({ dateFin: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-statut">Statut</Label>
            <Select 
              value={selectedPeriod?.statut || "ouv"}
              onValueChange={(v) => onUpdateSelectedPeriod({ statut: v as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ouv">Ouverte</SelectItem>
                <SelectItem value="clos">Clôturée</SelectItem>
                <SelectItem value="arch">Archivée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={onSave}
            disabled={!selectedPeriod?.libelle}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

interface AddAffectationModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  affData: any;
  setAffData: (data: any) => void;
  allMatieres: any[];
  filteredEnseignants: any[];
  isPending: boolean;
  onConfirm: () => void;
}

export function AddAffectationModal({
  isOpen,
  onClose,
  affData,
  setAffData,
  allMatieres,
  filteredEnseignants,
  isPending,
  onConfirm
}: AddAffectationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-[3rem] p-8 border-none shadow-2xl">
        <DialogHeader className="pb-6 border-b border-slate-50">
           <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">Affecter un Professeur</DialogTitle>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lier un prof à une matière dans cette classe</p>
        </DialogHeader>

        <div className="py-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Matière</label>
            <Select 
              value={affData.matiereId} 
              onValueChange={(v) => setAffData({...affData, matiereId: v || "", enseignantId: ""})}
            >
              <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] uppercase tracking-tight shadow-sm">
                <SelectValue placeholder="Choisir la matière" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl font-bold uppercase">
                {allMatieres.map(m => (
                  <SelectItem key={m.id} value={m.id.toString()}>{m.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Enseignant</label>
            <Select 
              disabled={!affData.matiereId} 
              value={affData.enseignantId} 
              onValueChange={(v) => setAffData({...affData, enseignantId: v || ""})}
            >
              <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] uppercase shadow-sm">
                <SelectValue placeholder="Choisir l'enseignant" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl font-bold uppercase">
                {filteredEnseignants.map(e => (
                  <SelectItem key={e.id} value={e.id.toString()}>
                    {e.user?.nom} {e.user?.prenom} {e.specialites && e.specialites.length > 0 ? `(${e.specialites.join(", ")})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Coefficient</label>
            <Select 
              value={affData.coefficient} 
              onValueChange={(v) => setAffData({...affData, coefficient: v || ""})}
            >
              <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl font-bold">
                {["1", "2", "3", "4", "5"].map(c => (
                  <SelectItem key={c} value={c}>Coeff {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
           <Button 
            variant="ghost" 
            onClick={() => onClose(false)} 
            className="h-12 rounded-2xl px-6 font-black text-slate-400 text-[10px] uppercase tracking-widest"
           >
            Annuler
           </Button>
           <Button 
            onClick={onConfirm}
            disabled={isPending || !affData.enseignantId || !affData.matiereId}
            className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 gap-2 shadow-xl shadow-emerald-900/10 transition-all active:scale-95 uppercase text-[10px] tracking-widest"
           >
             {isPending ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
             Affecter le Prof
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

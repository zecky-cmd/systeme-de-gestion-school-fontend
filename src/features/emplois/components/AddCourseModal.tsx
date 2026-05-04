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
import { DAYS_MAP, GRID_HOURS } from "../constants/schedule.constants";
import { DayOfWeek } from "@/services/schedule.service";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  availableMatieres: any[];
  availableAffectations: any[];
  isPending: boolean;
  onConfirm: () => void;
}

export function AddCourseModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  availableMatieres,
  availableAffectations,
  isPending,
  onConfirm
}: AddCourseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-[3rem] p-8 border-none shadow-2xl">
        <DialogHeader className="pb-6 border-b border-slate-50">
           <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">Ajouter un cours</DialogTitle>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Filtre intelligent par affectation</p>
        </DialogHeader>

        <div className="py-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Matière</label>
            <Select 
              value={formData.matiereId} 
              onValueChange={(v) => setFormData({...formData, matiereId: v || "", affectationId: ""})}
            >
              <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] uppercase tracking-tight shadow-sm">
                <SelectValue placeholder="Sélectionner une matière..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl font-bold uppercase">
                {availableMatieres.map(m => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                       {m.nom}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Professeur</label>
            <Select 
              disabled={!formData.matiereId} 
              value={formData.affectationId} 
              onValueChange={(v) => setFormData({...formData, affectationId: v || ""})}
            >
              <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] shadow-sm">
                <SelectValue placeholder={formData.matiereId ? "Choisir l'enseignant..." : "Matière requise"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl font-bold uppercase">
                {availableAffectations.map(aff => (
                  <SelectItem key={aff.id} value={aff.id.toString()}>
                    {aff.enseignant?.user?.nom} {aff.enseignant?.user?.prenom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Jour</label>
                <Select 
                  value={formData.day} 
                  onValueChange={(v) => setFormData({...formData, day: (v || "lun") as DayOfWeek})}
                >
                  <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl font-bold">
                    {Object.entries(DAYS_MAP).map(([k,v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Créneau</label>
                <Select 
                  value={formData.hourRange} 
                  onValueChange={(v) => setFormData({...formData, hourRange: v || ""})}
                >
                  <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl font-bold">
                    {GRID_HOURS.filter(h => h !== "PAUSE").map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Salle</label>
            <Select 
              value={formData.room} 
              onValueChange={(v) => setFormData({...formData, room: v || ""})}
            >
              <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] shadow-sm">
                <SelectValue placeholder="Choisir une salle..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl font-bold uppercase">
                {["S. 101", "S. 102", "S. 201", "Labo 1", "Labo 2", "Terrain"].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
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
            disabled={isPending || !formData.affectationId} 
            className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 gap-2 shadow-xl shadow-emerald-900/10 transition-all active:scale-95 uppercase text-[10px] tracking-widest"
           >
             {isPending ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} Ajouter le cours
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

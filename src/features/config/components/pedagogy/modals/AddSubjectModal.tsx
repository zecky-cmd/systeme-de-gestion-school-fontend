import { Plus } from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CoefStepper } from "../CoefStepper";
import { GROUPS } from "../constants";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
  levels: string[];
}

export function AddSubjectModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  levels
}: AddSubjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">Ajouter une matière</DialogTitle>
          <DialogDescription className="text-slate-500">Configurer la matière et ses coefficients par niveau</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">Nom de la matière</Label>
              <Input 
                placeholder="Ex: Informatique" 
                value={formData.nom} 
                onChange={e => setFormData({...formData, nom: e.target.value})} 
                className="rounded-xl border-slate-200" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">Code</Label>
              <Input 
                placeholder="Ex: INFO" 
                value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value})} 
                className="rounded-xl border-slate-200" 
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">Groupe</Label>
              <Select value={formData.groupe} onValueChange={v => setFormData({...formData, groupe: v || ""})}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Choisir un groupe..." />
                </SelectTrigger>
                <SelectContent>
                  {GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">Cycle</Label>
              <Select value={formData.cycle} onValueChange={(v: any) => setFormData({...formData, cycle: v})}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Choisir un cycle..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="col">1er Cycle</SelectItem>
                  <SelectItem value="lyc">2nd Cycle</SelectItem>
                  <SelectItem value="tous">Tous les cycles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-xs font-bold text-slate-700">Coefficients par niveau</Label>
            <div className="grid grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              {levels.map(l => (
                <div key={l} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase text-center">{l}</div>
                  <CoefStepper 
                    value={formData.coefficients?.[l] || 0} 
                    onChange={(v) => setFormData({...formData, coefficients: {...formData.coefficients, [l]: v}})}
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl px-8 font-bold">Annuler</Button>
            <Button type="submit" className="bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl px-10 font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all active:scale-95">
              <Plus size={18} /> Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

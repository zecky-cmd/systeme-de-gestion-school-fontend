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

interface AddLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  levelData: any;
  setLevelData: (data: any) => void;
}

export function AddLevelModal({
  isOpen,
  onClose,
  onSubmit,
  levelData,
  setLevelData
}: AddLevelModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">Ajouter un niveau</DialogTitle>
          <DialogDescription className="text-slate-500">Créez un nouveau niveau ou une classe (ex: 6e, 2nd C, Tle D)</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nom du niveau</Label>
            <Input 
              placeholder="Ex: 2nd C, Tle D..." 
              value={levelData.nom} 
              onChange={e => setLevelData({...levelData, nom: e.target.value})} 
              className="rounded-xl border-slate-200 py-6 text-lg focus:ring-emerald-500" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cycle</Label>
            <Select value={levelData.cycle} onValueChange={(v: "col" | "lyc" | null) => { if (v) setLevelData({...levelData, cycle: v}) }}>
              <SelectTrigger className="rounded-xl border-slate-200 py-6">
                <SelectValue placeholder="Choisir un cycle..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="col">1er Cycle</SelectItem>
                <SelectItem value="lyc">2nd Cycle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl px-8 font-bold border border-slate-100 h-12">Annuler</Button>
            <Button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-xl px-10 font-bold h-12 shadow-lg shadow-emerald-900/10 transition-all active:scale-95">
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

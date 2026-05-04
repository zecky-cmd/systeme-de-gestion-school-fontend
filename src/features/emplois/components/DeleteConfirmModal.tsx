import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden">
        <div className="bg-rose-50 p-8 flex flex-col items-center justify-center text-rose-600">
           <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
           </div>
           <h3 className="text-xl font-black tracking-tight">Suppression</h3>
        </div>
        
        <div className="p-8 space-y-6">
           <div className="text-center">
              <p className="text-sm font-bold text-slate-600">Êtes-vous sûr de vouloir supprimer cette affectation ?</p>
              <p className="text-[10px] font-medium text-slate-400 mt-2 leading-relaxed">
                Cette action est irréversible et pourrait impacter les cours déjà programmés dans l'emploi du temps.
              </p>
           </div>

           <div className="flex flex-col gap-3">
              <Button 
                onClick={onConfirm}
                disabled={isPending}
                className="h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-200 transition-all active:scale-95"
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : "Confirmer la suppression"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => onClose(false)}
                className="h-12 rounded-xl font-black text-slate-400 uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
              >
                Annuler
              </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

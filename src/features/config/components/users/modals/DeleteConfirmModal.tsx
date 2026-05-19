import React from "react";
import { AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter,
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName = "cet utilisateur"
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-rose-50 border-b border-rose-100 flex flex-row items-center gap-4 space-y-0">
          <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-rose-950 font-heading">
              Confirmer la suppression
            </DialogTitle>
            <p className="text-xs text-rose-700 mt-0.5">Cette action est irréversible.</p>
          </div>
        </DialogHeader>

        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Êtes-vous sûr de vouloir supprimer définitivement le compte de{" "}
            <span className="font-semibold text-slate-900">"{userName}"</span> ? Toutes ses données d'accès associées seront perdues.
          </p>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose} 
            className="hover:bg-slate-100 rounded-xl"
          >
            Annuler
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 shadow-lg shadow-rose-600/20 rounded-xl border-none"
          >
            Oui, supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

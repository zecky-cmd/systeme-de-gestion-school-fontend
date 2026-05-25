import React, { useState } from "react";
import { X } from "lucide-react";
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

interface CopyReductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceCategoryName: string;
  targetCategoryName: string;
  onConfirm: (reductionPercent: number) => Promise<void>;
}

export function CopyReductionModal({
  isOpen,
  onClose,
  sourceCategoryName,
  targetCategoryName,
  onConfirm
}: CopyReductionModalProps) {
  const [reduction, setReduction] = useState<number>(20);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(reduction);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white border-none shadow-2xl rounded-2xl overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-bold text-slate-900 font-heading">
            Copier avec réduction
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-500 leading-relaxed">
            Copier tous les tarifs de <span className="font-semibold text-slate-700">"{sourceCategoryName}"</span> vers <span className="font-semibold text-slate-700">"{targetCategoryName}"</span> avec une réduction.
          </p>

          <div className="space-y-2">
            <Label htmlFor="reduction" className="text-xs font-semibold text-slate-700">
              Pourcentage de réduction
            </Label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-[120px]">
                <Input
                  id="reduction"
                  type="number"
                  min="0"
                  max="100"
                  value={reduction}
                  onChange={(e) => setReduction(Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="w-full text-slate-800 border-slate-200 focus-visible:ring-primary rounded-xl pr-8 text-center font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                  %
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] mt-1 font-medium">
              Exemple: {reduction}% de réduction = {100 - reduction}% du prix original
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            disabled={isSubmitting}
            className="hover:bg-slate-100 rounded-xl"
          >
            Annuler
          </Button>
          <Button 
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 rounded-xl border-none shadow-lg shadow-primary/20"
          >
            {isSubmitting ? "Copie..." : `Copier avec -${reduction}%`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

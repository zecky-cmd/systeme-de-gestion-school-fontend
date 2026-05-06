import { AlertCircle } from "lucide-react";
import { 
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Supprimer la matière ?"
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-3xl">
        <DialogHeader className="items-center text-center">
          <AlertCircle size={48} className="text-rose-500 mb-2" />
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Annuler</Button>
          <Button variant="destructive" className="flex-1 rounded-xl" onClick={onConfirm}>Supprimer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

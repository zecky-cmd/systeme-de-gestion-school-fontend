import React from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { nom: string; description?: string }) => Promise<void>;
}

export function NewCategoryModal({
  isOpen,
  onClose,
  onAdd
}: NewCategoryModalProps) {
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<{
    nom: string;
    description: string;
  }>({
    defaultValues: {
      nom: "",
      description: ""
    }
  });

  const onSubmit = async (values: { nom: string; description: string }) => {
    try {
      await onAdd({
        nom: values.nom,
        description: values.description || undefined
      });
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        reset();
        onClose();
      }
    }}>
      <DialogContent className="max-w-md bg-white border-none shadow-2xl rounded-2xl overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-bold text-slate-900 font-heading">
            Nouvelle catégorie tarifaire
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nom" className="text-xs font-semibold text-slate-700">
                Nom de la catégorie
              </Label>
              <Input
                id="nom"
                placeholder="Ex: Boursier, Enfant du personnel..."
                className="w-full text-slate-800 placeholder-slate-400 border-slate-200 focus-visible:ring-primary rounded-xl"
                {...register("nom", { required: "Le nom est obligatoire" })}
              />
              {errors.nom && (
                <span className="text-[10px] text-rose-500 font-medium">{errors.nom.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-700">
                Description (optionnel)
              </Label>
              <Textarea
                id="description"
                placeholder="Ex: Élèves bénéficiant d'une bourse"
                className="w-full text-slate-800 placeholder-slate-400 border-slate-200 focus-visible:ring-primary rounded-xl min-h-[80px]"
                {...register("description")}
              />
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
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 rounded-xl border-none shadow-lg shadow-primary/20"
            >
              {isSubmitting ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

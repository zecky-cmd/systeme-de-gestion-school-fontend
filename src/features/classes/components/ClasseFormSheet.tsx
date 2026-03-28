"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Classe } from "@/services/classe.service";
import { Button } from "@/components/ui/button";
import { Loader2, School, Trash2 } from "lucide-react";
import { DeleteConfirm } from "@/components/shared/DeleteConfirm";
import { useClasseForm } from "../hooks/useClasseForm";
import { ClasseFormFields } from "./sub-components/ClasseFormFields";

interface ClasseFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit" | "view";
  initialData?: Classe | null;
}

export function ClasseFormSheet({ open, onOpenChange, mode, initialData }: ClasseFormSheetProps) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);

  const { form, onSubmit, deleteMutation, upsertMutation } = useClasseForm({
    mode,
    initialData,
    open,
    onOpenChange,
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <DeleteConfirm 
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title="Supprimer la classe ?"
        description={`Êtes-vous sûr de vouloir supprimer la classe "${initialData?.nom}" ? Cette action est irréversible.`}
      />
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-md p-0 flex flex-col border-l-0 shadow-2xl">
          <SheetHeader className={`p-6 ${isView ? 'bg-slate-800' : isEdit ? 'bg-blue-600' : 'bg-emerald-600'} text-white shrink-0`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <School className="h-5 w-5" />
              </div>
              <SheetTitle className="text-white text-xl font-black uppercase tracking-tight">
                {isView ? "Détails Classe" : isEdit ? "Modifier Classe" : "Nouvelle Classe"}
              </SheetTitle>
            </div>
            <SheetDescription className="text-white/80 text-xs font-medium">
              {isView ? "Consultation des paramètres de la section." : isEdit ? "Modifiez les informations de cette classe." : "Configurez une nouvelle section pédagogique."}
            </SheetDescription>
          </SheetHeader>

          <form 
            id="classe-form"
            onSubmit={form.handleSubmit(onSubmit)} 
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            <ClasseFormFields form={form} isView={isView} initialData={initialData} />
          </form>

          <SheetFooter className="p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 shrink-0 gap-2">
            {isEdit && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="h-12 border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-black text-xs uppercase"
                disabled={deleteMutation.isPending || upsertMutation.isPending}
              >
                {deleteMutation.isPending ? <Loader2 className="animate-spin" /> : <Trash2 size={18} />}
              </Button>
            )}
            
            {!isView ? (
              <Button 
                type="submit" 
                form="classe-form"
                className={`flex-1 h-12 ${isEdit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-black text-sm uppercase tracking-widest shadow-lg`}
                disabled={upsertMutation.isPending || deleteMutation.isPending}
              >
                {upsertMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    CHARGEMENT...
                  </>
                ) : (
                  isEdit ? "ENREGISTRER" : "CRÉER LA CLASSE"
                )}
              </Button>
            ) : (
              <Button 
                onClick={() => onOpenChange(false)}
                className="w-full h-12 bg-slate-800 text-white font-black text-sm uppercase"
              >
                FERMER
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

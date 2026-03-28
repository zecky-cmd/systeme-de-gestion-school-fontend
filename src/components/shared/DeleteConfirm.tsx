"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function DeleteConfirm({
  open,
  onOpenChange,
  onConfirm,
  title = "Confirmation de suppression",
  description = "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible et toutes les données associées seront perdues.",
  isLoading = false,
}: DeleteConfirmProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-none shadow-2xl p-0 overflow-hidden rounded-2xl">
        <div className="bg-rose-50 dark:bg-rose-900/20 p-6 flex flex-col items-center text-center space-y-3">
          <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600">
            <AlertTriangle className="h-8 w-8 animate-bounce" />
          </div>
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="p-6 bg-white dark:bg-slate-900 flex sm:justify-center gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 h-11 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          >
            ANNULER
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-11 font-black bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 uppercase tracking-widest text-[10px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                SUPPRESSION...
              </>
            ) : (
              "SUPPRIMER"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Trash2, 
  Settings2, 
  AlertCircle 
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RubriqueService, Rubrique } from "@/services/rubrique.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function RubriqueManager() {
  const queryClient = useQueryClient();
  const [newRubriqueNom, setNewRubriqueNom] = useState("");
  const [newRubriqueMontant, setNewRubriqueMontant] = useState("");

  const { data: rubriques = [], isLoading } = useQuery({
    queryKey: ["rubriques"],
    queryFn: () => RubriqueService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => RubriqueService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rubriques"] });
      setNewRubriqueNom("");
      setNewRubriqueMontant("");
      toast.success("Catégorie financière ajoutée !");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => RubriqueService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rubriques"] });
      toast.success("Catégorie supprimée.");
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Add Form */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom de la rubrique</label>
          <Input 
            placeholder="Ex: Frais de Scolarité..." 
            className="rounded-xl"
            value={newRubriqueNom}
            onChange={(e) => setNewRubriqueNom(e.target.value)}
          />
        </div>
        <div className="w-full md:w-32 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Montant (F)</label>
          <Input 
            type="number" 
            placeholder="0" 
            className="rounded-xl"
            value={newRubriqueMontant}
            onChange={(e) => setNewRubriqueMontant(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => createMutation.mutate({ nom: newRubriqueNom, montantParDefaut: parseFloat(newRubriqueMontant), estObligatoire: true, anneeId: 1 })}
          disabled={!newRubriqueNom || createMutation.isPending}
          className="rounded-xl bg-slate-900 dark:bg-emerald-600 text-white font-bold h-10 px-6 uppercase text-[10px] tracking-widest"
        >
          <Plus size={16} className="mr-2" /> Ajouter
        </Button>
      </div>

      {/* List Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/40">
            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
              <TableHead className="font-black text-[9px] uppercase tracking-widest py-5 pl-6 text-slate-400">Rubrique</TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest py-5 text-slate-400">Montant Défaut</TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest py-5 text-slate-400">Obligatoire</TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest py-5 text-right pr-6 text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rubriques.map((r) => (
              <TableRow key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 border-slate-50 dark:border-slate-800/50">
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Settings2 size={14} className="text-slate-400" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white uppercase">{r.nom}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-black text-xs text-slate-600 dark:text-slate-400">{r.montantParDefaut?.toLocaleString() || 0} F</span>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-full ring-1 shadow-sm",
                    r.estObligatoire ? "bg-emerald-50 text-emerald-600 ring-emerald-500/10" : "bg-slate-50 text-slate-400 ring-slate-500/10"
                  )}>
                    {r.estObligatoire ? "Oui" : "Non"}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-all"
                    onClick={() => deleteMutation.mutate(r.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rubriques.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-400 italic">
                  Aucune rubrique configurée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/20 flex gap-3">
        <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-tight leading-relaxed">
          Les rubriques obligatoires s'appliquent automatiquement à tous les élèves lors de la génération de leur situation financière annuelle.
        </p>
      </div>
    </div>
  );
}

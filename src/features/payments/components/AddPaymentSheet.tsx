"use client";

import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentService, Eleve } from "@/services/student.service";
import { RubriqueService, Rubrique } from "@/services/rubrique.service";
import { PaiementService, ModePaiement } from "@/services/paiement.service";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { 
  Loader2, 
  Search, 
  Check, 
  Wallet, 
  Smartphone, 
  CreditCard,
  Banknote,
  Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddPaymentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentSheet({ open, onOpenChange }: AddPaymentSheetProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  // États du formulaire
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Eleve | null>(null);
  const [rubriqueId, setRubriqueId] = useState<string>("");
  const [montant, setMontant] = useState<string>("");
  const [mode, setMode] = useState<ModePaiement>("esp");
  const [reference, setReference] = useState("");
  const [recuNum, setRecuNum] = useState(`REC-${Date.now().toString().slice(-6)}`);

  // Requêtes
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students-search", studentSearch],
    queryFn: StudentService.getAll,
    enabled: open,
  });

  const { data: rubriques = [] } = useQuery({
    queryKey: ["rubriques-active"],
    queryFn: () => RubriqueService.getAll(),
    enabled: open,
  });

  // Filtrage des élèves
  const filteredStudents = students.filter(s => 
    `${s.nom} ${s.prenom} ${s.matricule}`.toLowerCase().includes(studentSearch.toLowerCase())
  ).slice(0, 5);

  // Mutation pour créer le paiement
  const createMutation = useMutation({
    mutationFn: PaiementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Versement enregistré avec succès !");
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
    }
  });

  const resetForm = () => {
    setSelectedStudent(null);
    setStudentSearch("");
    setRubriqueId("");
    setMontant("");
    setMode("esp");
    setReference("");
    setRecuNum(`REC-${Date.now().toString().slice(-6)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !rubriqueId || !montant || !user?.id) return;

    createMutation.mutate({
      eleveId: selectedStudent.id,
      rubriqueId: parseInt(rubriqueId),
      encaisseParId: user.id,
      montant: parseFloat(montant),
      mode,
      reference,
      recuNum,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md border-l-slate-200 dark:border-l-slate-800 p-0 overflow-hidden flex flex-col">
        <SheetHeader className="p-8 pb-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="size-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20">
            <Wallet size={24} />
          </div>
          <SheetTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Encaisser un Versement</SheetTitle>
          <SheetDescription className="text-slate-500 font-medium">Record a new payment transaction with receipt tracking.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none">
          
          {/* Recherche d'Élève */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Élève Concerné</Label>
            {selectedStudent ? (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-emerald-900 dark:text-emerald-400 uppercase leading-none">
                    {selectedStudent.nom} {selectedStudent.prenom}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600/70 mt-1 uppercase">
                    Matricule: {selectedStudent.matricule}
                  </span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-[10px] font-black uppercase tracking-widest text-emerald-600"
                  onClick={() => setSelectedStudent(null)}
                >
                  Changer
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher par nom ou matricule..." 
                  className="pl-10 h-10 rounded-xl bg-slate-50/50 border-slate-200 transition-all focus:ring-emerald-500"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
                {studentSearch && filteredStudents.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-1">
                    {filteredStudents.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group"
                        onClick={() => {
                          setSelectedStudent(s);
                          setStudentSearch("");
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">{s.nom} {s.prenom}</span>
                          <span className="text-[10px] text-slate-400">{s.matricule} • {s.classe?.nom}</span>
                        </div>
                        <Check className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rubrique & Montant */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Objet du frais</Label>
              <Select value={rubriqueId} onValueChange={(val) => val && setRubriqueId(val)}>
                <SelectTrigger className="h-10 rounded-xl bg-slate-50/50">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {rubriques.map(r => (
                    <SelectItem key={r.id} value={r.id.toString()} className="rounded-lg">{r.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Montant (F)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                className="h-10 rounded-xl bg-slate-50/50"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mode de Paiement */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mode de Versement</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "esp", label: "Espèces", icon: Banknote, color: "text-emerald-500" },
                { id: "mobile", label: "Mobile", icon: Smartphone, color: "text-orange-500" },
                { id: "cheque", label: "Chèque", icon: CreditCard, color: "text-blue-500" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                    mode === m.id 
                      ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                  )}
                  onClick={() => setMode(m.id as ModePaiement)}
                >
                  <m.icon className={cn("size-6", m.color)} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Référence & Reçu */}
          <div className="space-y-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">N° Reçu</Label>
                <div className="relative">
                   <Receipt className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                   <Input 
                     value={recuNum}
                     onChange={(e) => setRecuNum(e.target.value)}
                     className="pl-10 h-10 rounded-xl bg-slate-50/50 border-slate-200"
                   />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Référence (Ex: Orange Money)</Label>
                <Input 
                   placeholder="Ex: TR-12345..." 
                   className="h-10 rounded-xl bg-slate-50/50 border-slate-200"
                   value={reference}
                   onChange={(e) => setReference(e.target.value)}
                />
              </div>
            </div>
          </div>

        </form>

        <SheetFooter className="p-8 pt-4 bg-slate-50/50 dark:bg-slate-900/50 gap-3 border-t border-slate-200 dark:border-slate-800 sm:justify-end">
          <Button 
            variant="ghost" 
            className="rounded-xl px-6 font-bold text-slate-500"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
             onClick={handleSubmit}
             disabled={createMutation.isPending || !selectedStudent || !rubriqueId || !montant}
             className="rounded-xl px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20"
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Enregistrer le Paiement"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

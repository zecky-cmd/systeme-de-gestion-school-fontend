"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
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
  Banknote,
  Smartphone,
  CreditCard,
  Landmark
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentModal({ open, onOpenChange }: AddPaymentModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  // États du formulaire
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Eleve | null>(null);
  const [rubriqueId, setRubriqueId] = useState<string>("");
  const [montant, setMontant] = useState<string>("");
  const [mode, setMode] = useState<ModePaiement>("esp");
  const [activeModeId, setActiveModeId] = useState<string>("esp");
  const [reference, setReference] = useState("");
  const [commentaire, setCommentaire] = useState("");

  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students-all"],
    queryFn: StudentService.getAll,
    enabled: open,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to prevent refetching
  });

  const { data: rubriques = [] } = useQuery({
    queryKey: ["rubriques-active"],
    queryFn: () => RubriqueService.getAll(),
    enabled: open,
  });

  // Filtrage des élèves
  const filteredStudents = students.filter(s => 
    `${s.nom || s.user?.nom} ${s.prenom || s.user?.prenom} ${s.matricule}`.toLowerCase().includes(studentSearch.toLowerCase())
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
    setActiveModeId("esp");
    setReference("");
    setCommentaire("");
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
      // We don't send commentaire because it's not in the DTO yet, but UI is ready
    });
  };

  const paymentModes = [
    { id: "esp", label: "Espèces", icon: Banknote },
    { id: "mobile-orange", mode: "mobile", refPrefix: "OM-", label: "Orange Money", icon: Smartphone },
    { id: "mobile-mtn", mode: "mobile", refPrefix: "MTN-", label: "MTN Money", icon: Smartphone },
    { id: "mobile-wave", mode: "mobile", refPrefix: "WV-", label: "Wave", icon: Smartphone },
    { id: "virement", mode: "virement", label: "Virement bancaire", icon: Landmark },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-slate-50 gap-0">
        <DialogHeader className="px-6 py-4 bg-white border-b flex flex-row items-center gap-3">
          <div className="flex items-center justify-center p-2 rounded-lg bg-emerald-100 text-emerald-700">
            <Banknote size={20} />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-slate-800">Nouvel encaissement</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">Enregistrer un nouveau paiement de frais scolaires.</DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh] p-6 space-y-6">
          
          {/* Section 1: Informations de l'élève */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Informations de l'élève</h3>
            
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">Sélectionner un élève <span className="text-red-500">*</span></Label>
              {selectedStudent ? (
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">
                      {selectedStudent.nom || selectedStudent.user?.nom} {selectedStudent.prenom || selectedStudent.user?.prenom}
                    </span>
                    <span className="text-xs text-slate-500">
                      Matricule: {selectedStudent.matricule} • Classe: {selectedStudent.classe?.nom || selectedStudent.currentClasse || "Non défini"}
                    </span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    onClick={() => setSelectedStudent(null)}
                  >
                    Modifier
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Rechercher par nom, prénom ou matricule..." 
                    className="pl-9 h-10 border-slate-200 focus-visible:ring-emerald-500"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                  {studentSearch && filteredStudents.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden p-1">
                      {filteredStudents.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          className="w-full text-left p-2 rounded-md hover:bg-slate-50 transition-colors flex flex-col group"
                          onClick={() => {
                            setSelectedStudent(s);
                            setStudentSearch("");
                          }}
                        >
                          <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600">{s.nom || s.user?.nom} {s.prenom || s.user?.prenom}</span>
                          <span className="text-xs text-slate-500">{s.matricule} • {s.classe?.nom || s.currentClasse}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Classe Disabled field just to match mockup visual flow, auto-filled by student selection */}
            <div className="space-y-3 pt-2">
              <Label className="text-sm font-semibold text-slate-700">Classe <span className="text-red-500">*</span></Label>
              <Input 
                disabled
                value={selectedStudent ? (selectedStudent.classe?.nom || selectedStudent.currentClasse || "Non inscrit") : ""}
                placeholder="Sélectionné automatiquement"
                className="bg-slate-50/50"
              />
            </div>
          </div>

          {/* Section 2: Détails du paiement */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Détails du paiement</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Rubrique <span className="text-red-500">*</span></Label>
                <Select value={rubriqueId} onValueChange={(val) => val && setRubriqueId(val)}>
                  <SelectTrigger className="h-10 border-slate-200 focus:ring-emerald-500">
                    <SelectValue placeholder="Type de frais" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]" alignItemWithTrigger={false}>
                    {rubriques.map(r => (
                      <SelectItem key={r.id} value={r.id.toString()}>{r.libelle}</SelectItem>
                    ))}
                    {rubriques.length === 0 && (
                      <SelectItem value="empty" disabled>Aucune rubrique</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 relative">
                <Label className="text-sm font-semibold text-slate-700">Montant (FCFA) <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="0" 
                    className="h-10 border-slate-200 focus-visible:ring-emerald-500 pr-12 text-right"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-sm font-medium text-slate-400">FCFA</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">Mode de paiement <span className="text-red-500">*</span></Label>
              <div className="flex flex-wrap gap-2">
                {paymentModes.map((m) => {
                  const isSelected = activeModeId === m.id;
                  // Note: simple toggle won't work perfectly for sub-mobile types without tweaking reference, 
                  // but we handle selection below
                  return (
                    <button
                      key={m.id}
                      type="button"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 text-emerald-800" 
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      )}
                      onClick={() => {
                        setMode(m.mode as ModePaiement);
                        setActiveModeId(m.id);
                        if (m.mode === 'mobile' && m.refPrefix) {
                          if (!reference.startsWith(m.refPrefix)) setReference(m.refPrefix);
                        } else {
                          setReference("");
                        }
                      }}
                    >
                      <m.icon className={cn("size-4", isSelected ? "text-emerald-600" : "text-slate-400")} />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {mode === "mobile" && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Référence de transaction <span className="text-red-500">*</span></Label>
                <Input 
                   placeholder="ex: MP240228XXXX" 
                   className="h-10 border-slate-200 focus-visible:ring-emerald-500"
                   value={reference}
                   onChange={(e) => setReference(e.target.value)}
                   required={mode === "mobile"}
                />
              </div>
            )}
          </div>

          {/* Section 3: Commentaire */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Commentaire (optionnel)</Label>
            <Textarea 
              placeholder="Note interne sur ce paiement..."
              className="resize-none border-slate-200 focus-visible:ring-emerald-500"
              rows={3}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>

        </form>

        <DialogFooter className="px-6 py-4 bg-white border-t flex items-center justify-end gap-2">
          <Button 
            type="button"
            variant="outline" 
            className="rounded-lg px-6 font-semibold border-slate-200 text-slate-600 hover:bg-slate-50"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
             onClick={handleSubmit}
             disabled={createMutation.isPending || !selectedStudent || !rubriqueId || !montant}
             className="rounded-lg px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-2 shadow-sm"
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Enregistrer le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

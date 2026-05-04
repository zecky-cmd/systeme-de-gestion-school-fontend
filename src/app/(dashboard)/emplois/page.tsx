"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Printer, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Clock,
  MapPin,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  Users,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

// Services
import { ClasseService } from "@/services/classe.service";
import { ScheduleService, DayOfWeek } from "@/services/schedule.service";
import { AffectationService } from "@/services/affectation.service";
import { MatiereService } from "@/services/matiere.service";
import { EnseignantService } from "@/services/enseignant.service";

// --- Configuration & Mapping ---
const DAYS_MAP: Record<string, string> = {
  "lun": "Lundi",
  "mar": "Mardi",
  "mer": "Mercredi",
  "jeu": "Jeudi",
  "ven": "Vendredi",
  "sam": "Samedi"
};

const REV_DAYS_MAP: Record<string, DayOfWeek> = {
  "Lundi": "lun",
  "Mardi": "mar",
  "Mercredi": "mer",
  "Jeudi": "jeu",
  "Vendredi": "ven",
  "Samedi": "sam"
};

const GRID_HOURS = [
  "07h30 - 08h30", "08h30 - 09h30", "09h30 - 10h30", 
  "PAUSE", 
  "11h00 - 12h00", "12h00 - 13h00", 
  "14h00 - 15h00", "15h00 - 16h00", "16h00 - 17h00"
];

const COLORS_PALETTE = [
  "bg-emerald-50 border-emerald-500/20 text-emerald-700",
  "bg-blue-50 border-blue-500/20 text-blue-700",
  "bg-orange-50 border-orange-500/20 text-orange-700",
  "bg-rose-50 border-rose-500/20 text-rose-700",
  "bg-amber-50 border-amber-500/20 text-amber-700",
  "bg-teal-50 border-teal-500/20 text-teal-700",
];

export default function EmploisPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"planning" | "affectations">("planning");
  const [selectedClasseId, setSelectedClasseId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAffModalOpen, setIsAffModalOpen] = useState(false);
  
  // Modal Form State
  const [formData, setFormData] = useState({
    day: "lun" as DayOfWeek,
    hourRange: "07h30 - 08h30",
    affectationId: "",
    room: ""
  });

  // Affectation Form State
  const [affData, setAffData] = useState({
    matiereId: "",
    enseignantId: "",
    coefficient: "2"
  });

  // 1. Fetch Classes
  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: () => ClasseService.getAll(),
    onSuccess: (data) => {
      if (data.length > 0 && !selectedClasseId) setSelectedClasseId(data[0].id.toString());
    }
  });

  // 2. Fetch Affectations
  const { data: affectations = [], isLoading: isAffLoading } = useQuery({
    queryKey: ["affectations", selectedClasseId],
    queryFn: () => AffectationService.getAll(parseInt(selectedClasseId)),
    enabled: !!selectedClasseId
  });

  // 3. Fetch Créneaux
  const { data: slots = [], isLoading: isSlotsLoading } = useQuery({
    queryKey: ["creneaux", selectedClasseId],
    queryFn: () => ScheduleService.getAll(parseInt(selectedClasseId)),
    enabled: !!selectedClasseId
  });

  // 4. Fetch Global Data
  const { data: allMatieres = [] } = useQuery({ queryKey: ["matieres"], queryFn: MatiereService.getAll });
  const { data: allEnseignants = [] } = useQuery({ queryKey: ["enseignants"], queryFn: EnseignantService.getAll });

  // Mutations
  const createSlotMutation = useMutation({
    mutationFn: ScheduleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creneaux"] });
      setIsModalOpen(false);
      toast.success("Cours ajouté !");
    }
  });

  const createAffMutation = useMutation({
    mutationFn: (data: any) => AffectationService.create({ ...data, classeId: parseInt(selectedClasseId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affectations"] });
      setIsAffModalOpen(false);
      toast.success("Enseignant affecté avec succès !");
    }
  });

  const openAddModal = (dayLabel?: string, hourRange?: string) => {
    setFormData({
      day: dayLabel ? REV_DAYS_MAP[dayLabel] : "lun",
      hourRange: hourRange || "07h30 - 08h30",
      affectationId: "",
      room: ""
    });
    setIsModalOpen(true);
  };

  const handleAddCourse = () => {
    if (!formData.affectationId) return;
    const [start, end] = formData.hourRange.split(" - ");
    createSlotMutation.mutate({
      matiereNiveauId: parseInt(formData.affectationId),
      jour: formData.day,
      heureDebut: `2024-01-01T${start.replace("h", ":")}:00.000Z`,
      heureFin: `2024-01-01T${end.replace("h", ":")}:00.000Z`,
      salle: formData.room
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      {/* --- TOP BAR --- */}
      <div className="p-4 lg:px-8 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Emplois du temps</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Année scolaire 2025-2026</p>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
             <button 
              onClick={() => setActiveTab("planning")}
              className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all", activeTab === "planning" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
             >
               Planning
             </button>
             <button 
              onClick={() => setActiveTab("affectations")}
              className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all", activeTab === "affectations" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
             >
               Affectations
             </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedClasseId} onValueChange={setSelectedClasseId}>
            <SelectTrigger className="w-44 h-9 rounded-lg border-slate-200 bg-white font-bold text-slate-700 text-xs shadow-sm">
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent className="rounded-lg font-bold">
              {classes.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.nom}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "planning" ? (
          <motion.div 
            key="planning"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Actions Bar */}
            <div className="p-4 lg:px-8 flex items-center justify-between">
               <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronLeft size={16} /></Button>
                  <span className="px-3 text-[9px] font-black text-slate-500 uppercase">Semaine 9 (24 - 28 Fev 2026)</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight size={16} /></Button>
               </div>
               <div className="flex items-center gap-2">
                  <Button variant="outline" className="h-9 rounded-lg border-slate-200 font-bold px-4 text-xs gap-2">
                    <Printer size={16} /> Imprimer
                  </Button>
                  <Button onClick={() => openAddModal()} className="h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 text-xs gap-2">
                    <Plus size={18} /> Ajouter un cours
                  </Button>
               </div>
            </div>

            {/* Grid */}
            <div className="flex-1 px-4 lg:px-8 pb-8 overflow-auto scrollbar-none">
               <div className="min-w-[1000px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-slate-50 border-b border-slate-200">
                    <div className="h-10 flex items-center justify-center border-r border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">Horaires</div>
                    {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map(day => (
                      <div key={day} className="h-10 flex items-center justify-center border-r border-slate-200 last:border-0 text-[10px] font-black text-slate-500 uppercase tracking-widest">{day}</div>
                    ))}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {GRID_HOURS.map((hourRange) => (
                      <div key={hourRange} className={cn("grid grid-cols-[100px_repeat(5,1fr)]", hourRange === "PAUSE" ? "h-10 bg-slate-50/20" : "min-h-[85px]")}>
                        <div className="flex items-center justify-center border-r border-slate-200 text-[10px] font-bold text-slate-400">{hourRange}</div>
                        {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map(dayLabel => {
                          const slot = slots.find(s => s.jour === REV_DAYS_MAP[dayLabel] && hourRange.includes(s.heureDebut.split("T")[1].substring(0, 5).replace(":", "h")));
                          return (
                            <div key={`${dayLabel}-${hourRange}`} className="relative p-1.5 border-r border-slate-100 last:border-0 group">
                              {hourRange === "PAUSE" ? (
                                <div className="flex items-center justify-center h-full text-[9px] font-bold text-slate-300 italic">Pause</div>
                              ) : slot ? (
                                <div className={cn("absolute inset-1.5 rounded-xl border p-2.5 flex flex-col justify-between shadow-sm", COLORS_PALETTE[slot.id % COLORS_PALETTE.length])}>
                                  <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-tight">{slot.matiereNiveau?.matiere?.nom}</h4>
                                    <p className="text-[9px] font-bold opacity-80 mt-0.5">{slot.matiereNiveau?.enseignant?.user?.nom}</p>
                                  </div>
                                  <div className="text-[8px] font-black opacity-60 flex justify-between">
                                    <span>{slot.salle}</span>
                                    <X size={10} className="opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => ScheduleService.delete(slot.id).then(() => queryClient.invalidateQueries({queryKey:["creneaux"]}))} />
                                  </div>
                                </div>
                              ) : (
                                <div onClick={() => openAddModal(dayLabel, hourRange)} className="absolute inset-1.5 border border-dashed border-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-emerald-50/30 transition-all group/btn">
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus size={12} className="text-emerald-500" />
                                    <span className="text-[9px] font-black text-emerald-600 uppercase">Libre</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="affectations"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 overflow-auto"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <div>
                    <h2 className="text-lg font-black text-slate-900">Affectations de la classe</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lier les professeurs aux matières</p>
                 </div>
                 <Button onClick={() => setIsAffModalOpen(true)} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 shadow-lg shadow-emerald-500/20 gap-2">
                    <Users size={18} /> Affecter un Prof
                 </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {affectations.map(aff => (
                   <div key={aff.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-emerald-200 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <BookOpen size={20} />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-slate-900">{aff.matiere?.nom}</h4>
                            <p className="text-xs font-bold text-slate-400">{aff.enseignant?.user?.nom} {aff.enseignant?.user?.prenom}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase">Coeff {aff.coefficient}</div>
                         <Button variant="ghost" size="icon" className="text-rose-400 hover:text-rose-600 h-8 w-8 rounded-lg"><X size={16} /></Button>
                      </div>
                   </div>
                 ))}
                 {affectations.length === 0 && !isAffLoading && (
                   <div className="col-span-full h-40 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-2">
                      <AlertCircle size={24} />
                      <p className="text-xs font-bold uppercase tracking-widest">Aucune affectation pour le moment</p>
                   </div>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL AJOUT COURS (Filtre par affectations) --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] p-8 border-none shadow-2xl">
          <DialogHeader className="pb-6 border-b border-slate-50">
             <DialogTitle className="text-lg font-black text-slate-900">Ajouter un cours</DialogTitle>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uniquement les matières affectées</p>
          </DialogHeader>

          <div className="py-6 space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Matière</label>
              <Select value={formData.affectationId} onValueChange={(v) => setFormData({...formData, affectationId: v})}>
                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs">
                  <SelectValue placeholder="Sélectionner une affectation..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  {affectations.map(aff => (
                    <SelectItem key={aff.id} value={aff.id.toString()}>
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                         <span>{aff.matiere?.nom}</span>
                         <span className="text-slate-400 font-medium">— {aff.enseignant?.user?.nom}</span>
                      </div>
                    </SelectItem>
                  ))}
                  {affectations.length === 0 && <div className="p-2 text-[10px] text-rose-500 font-bold">Aucune affectation trouvée pour cette classe.</div>}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Jour</label>
                  <Select value={formData.day} onValueChange={(v) => setFormData({...formData, day: v as DayOfWeek})}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">{Object.entries(DAYS_MAP).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Heure</label>
                  <Select value={formData.hourRange} onValueChange={(v) => setFormData({...formData, hourRange: v})}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">{GRID_HOURS.filter(h => h !== "PAUSE").map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                  </Select>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Salle</label>
              <Select value={formData.room} onValueChange={(v) => setFormData({...formData, room: v})}>
                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs"><SelectValue placeholder="Choisir une salle..." /></SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  {["S. 101", "S. 102", "S. 201", "Labo 1", "Labo 2", "Terrain"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
             <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="h-12 rounded-xl px-6 font-bold text-slate-400 text-xs">Annuler</Button>
             <Button 
              onClick={handleAddCourse}
              disabled={createSlotMutation.isPending || !formData.affectationId}
              className="h-12 rounded-xl bg-[#67A68C] hover:bg-[#5a927a] text-white font-black px-8 gap-2 shadow-lg"
             >
               {createSlotMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
               Ajouter le cours
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL AFFECTATION --- */}
      <Dialog open={isAffModalOpen} onOpenChange={setIsAffModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] p-8 border-none shadow-2xl">
          <DialogHeader className="pb-6 border-b border-slate-50">
             <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">Affecter un Professeur</DialogTitle>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lier un prof à une matière dans cette classe</p>
          </DialogHeader>

          <div className="py-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Matière</label>
              <Select value={affData.matiereId} onValueChange={(v) => setAffData({...affData, matiereId: v})}>
                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs"><SelectValue placeholder="Choisir la matière" /></SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  {allMatieres.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Enseignant</label>
              <Select value={affData.enseignantId} onValueChange={(v) => setAffData({...affData, enseignantId: v})}>
                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs"><SelectValue placeholder="Choisir l'enseignant" /></SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  {allEnseignants.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.user?.nom} {e.user?.prenom} ({e.specialite})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Coefficient</label>
              <Select value={affData.coefficient} onValueChange={(v) => setAffData({...affData, coefficient: v})}>
                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-black text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  {["1", "2", "3", "4", "5"].map(c => <SelectItem key={c} value={c}>Coeff {c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
             <Button variant="ghost" onClick={() => setIsAffModalOpen(false)} className="h-12 rounded-xl px-6 font-black text-slate-400 text-xs">Annuler</Button>
             <Button 
              onClick={() => createAffMutation.mutate({ matiereId: parseInt(affData.matiereId), enseignantId: parseInt(affData.enseignantId), coefficient: parseInt(affData.coefficient), noteMax: 20 })}
              disabled={createAffMutation.isPending || !affData.enseignantId || !affData.matiereId}
              className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 gap-2 shadow-lg"
             >
               {createAffMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
               Affecter le Prof
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

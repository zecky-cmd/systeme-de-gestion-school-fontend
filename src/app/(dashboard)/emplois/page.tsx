"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  LayoutGrid,
  Trash2,
  AlertTriangle
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
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  // Modal Form State
  const [formData, setFormData] = useState({
    day: "lun" as DayOfWeek,
    hourRange: "07h30 - 08h30",
    matiereId: "",
    affectationId: "",
    room: ""
  });

  // Affectation Form State
  const [affData, setAffData] = useState({
    classeId: "",
    matiereId: "",
    enseignantId: "",
    coefficient: "2"
  });

  // 1. Fetch Classes
  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: () => ClasseService.getAll(),
  });

  // Initialisation de la classe par défaut
  useEffect(() => {
    if (classes && classes.length > 0 && !selectedClasseId) {
      setSelectedClasseId(classes[0].id.toString());
    }
  }, [classes, selectedClasseId]);

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

  // 4. Global Data
  const { data: allMatieres = [] } = useQuery({ queryKey: ["matieres"], queryFn: () => MatiereService.getAll() });
  const { data: allEnseignants = [] } = useQuery({ queryKey: ["enseignants"], queryFn: () => EnseignantService.getAll() });

  // --- LOGIQUE DE FILTRAGE ---

  const availableMatieresInModal = useMemo(() => {
    const uniqueIds = Array.from(new Set(affectations.map(a => a.matiereId)));
    return allMatieres.filter(m => uniqueIds.includes(m.id));
  }, [affectations, allMatieres]);

  const availableAffectationsForMatiere = useMemo(() => {
    if (!formData.matiereId) return [];
    return affectations.filter(a => a.matiereId.toString() === formData.matiereId);
  }, [formData.matiereId, affectations]);

  const filteredEnseignantsForAff = useMemo(() => {
    if (!affData.matiereId) return [];
    const selectedMatiere = allMatieres.find(m => m.id.toString() === affData.matiereId);
    if (!selectedMatiere) return [];
    return allEnseignants.filter(e => 
      e.specialites && e.specialites.some(s => s.toLowerCase() === selectedMatiere.nom.toLowerCase())
    );
  }, [affData.matiereId, allMatieres, allEnseignants]);

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
    mutationFn: (data: any) => AffectationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affectations"] });
      setIsAffModalOpen(false);
      setAffData({ matiereId: "", enseignantId: "", coefficient: "2", classeId: selectedClasseId });
      toast.success("Enseignant affecté !");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Erreur d'affectation")
  });

  const deleteAffMutation = useMutation({
    mutationFn: AffectationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affectations"] });
      setDeleteConfirmId(null);
      toast.success("Affectation supprimée !");
    },
    onError: (error: any) => toast.error("Erreur lors de la suppression")
  });

  const openAddModal = (dayLabel?: string, hourRange?: string) => {
    setFormData({
      day: dayLabel ? REV_DAYS_MAP[dayLabel] : "lun",
      hourRange: hourRange || "07h30 - 08h30",
      matiereId: "",
      affectationId: "",
      room: ""
    });
    setIsModalOpen(true);
  };

  const openAffModal = () => {
    setAffData({
      classeId: selectedClasseId,
      matiereId: "",
      enseignantId: "",
      coefficient: "2"
    });
    setIsAffModalOpen(true);
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
      <div className="p-4 lg:px-8 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm relative z-10">
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
          <Select value={selectedClasseId} onValueChange={(v) => setSelectedClasseId(v || "")}>
            <SelectTrigger className="w-44 h-10 rounded-xl border-slate-200 bg-white font-bold text-slate-700 text-[11px] shadow-sm uppercase">
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent className="rounded-xl font-bold">
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
               <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><ChevronLeft size={16} /></Button>
                  <span className="px-3 text-[10px] font-black text-slate-500 uppercase">Semaine 9</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><ChevronRight size={16} /></Button>
               </div>
               <div className="flex items-center gap-2">
                  <Button variant="outline" className="h-10 rounded-xl border-slate-200 font-bold px-4 text-xs gap-2 shadow-sm">
                    <Printer size={16} /> Imprimer
                  </Button>
                  <Button onClick={() => openAddModal()} className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 text-xs gap-2 shadow-lg shadow-emerald-500/20 uppercase tracking-widest">
                    <Plus size={18} /> Ajouter un cours
                  </Button>
               </div>
            </div>

            {/* Grid */}
            <div className="flex-1 px-4 lg:px-8 pb-8 overflow-auto scrollbar-none">
               <div className="min-w-[1000px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-[110px_repeat(5,1fr)] bg-slate-50 border-b border-slate-200">
                    <div className="h-12 flex items-center justify-center border-r border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Horaires</div>
                    {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map(day => (
                      <div key={day} className="h-12 flex items-center justify-center border-r border-slate-200 last:border-0 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{day}</div>
                    ))}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {GRID_HOURS.map((hourRange) => (
                      <div key={hourRange} className={cn("grid grid-cols-[110px_repeat(5,1fr)]", hourRange === "PAUSE" ? "h-12 bg-slate-50/20" : "min-h-[90px]")}>
                        <div className="flex items-center justify-center border-r border-slate-200 text-[10px] font-black text-slate-400">{hourRange}</div>
                        {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map(dayLabel => {
                          const slot = slots.find(s => s.jour === REV_DAYS_MAP[dayLabel] && hourRange.includes(s.heureDebut.split("T")[1].substring(0, 5).replace(":", "h")));
                          return (
                            <div key={`${dayLabel}-${hourRange}`} className="relative p-2 border-r border-slate-100 last:border-0 group">
                              {hourRange === "PAUSE" ? (
                                <div className="flex items-center justify-center h-full text-[9px] font-bold text-slate-300 italic uppercase tracking-widest">Pause</div>
                              ) : slot ? (
                                <div className={cn("absolute inset-2 rounded-2xl border-2 p-3 flex flex-col justify-between shadow-sm transition-all hover:scale-[1.02]", COLORS_PALETTE[slot.id % COLORS_PALETTE.length])}>
                                  <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{slot.matiereNiveau?.matiere?.nom}</h4>
                                    <p className="text-[9px] font-bold opacity-80 mt-1 flex items-center gap-1">
                                       <Users size={10} className="opacity-50" /> {slot.matiereNiveau?.enseignant?.user?.nom}
                                    </p>
                                  </div>
                                  <div className="text-[9px] font-black opacity-60 flex justify-between items-center">
                                    <span className="flex items-center gap-1"><MapPin size={10} /> {slot.salle}</span>
                                    <X size={12} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-rose-500 transition-all" onClick={() => ScheduleService.delete(slot.id).then(() => queryClient.invalidateQueries({queryKey:["creneaux"]}))} />
                                  </div>
                                </div>
                              ) : (
                                <div onClick={() => openAddModal(dayLabel, hourRange)} className="absolute inset-2 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-emerald-50/30 transition-all group/btn">
                                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                    <Plus size={14} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Libre</span>
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
              <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                 <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Affectations de la classe</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lier les professeurs aux matières</p>
                 </div>
                 <Button onClick={openAffModal} className="rounded-2xl bg-[#065F46] hover:bg-[#054a37] text-white font-black px-8 h-12 shadow-lg shadow-emerald-500/20 gap-3">
                    <Plus size={18} /> Affecter un Prof
                 </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {affectations.map(aff => (
                   <div key={aff.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-emerald-500 transition-all shadow-sm">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <BookOpen size={24} />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{aff.matiere?.nom}</h4>
                            <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                               <Users size={12} className="opacity-50" /> {aff.enseignant?.user?.nom} {aff.enseignant?.user?.prenom}
                            </p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-md uppercase tracking-widest">Coeff {aff.coefficient}</div>
                         <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setDeleteConfirmId(aff.id)}
                          className="text-rose-300 hover:text-rose-600 hover:bg-rose-50 h-10 w-10 rounded-xl transition-all"
                         >
                            <Trash2 size={18} />
                         </Button>
                      </div>
                   </div>
                 ))}
                 {affectations.length === 0 && !isAffLoading && (
                   <div className="col-span-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 gap-2">
                      <AlertCircle size={32} className="opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest">Aucune affectation trouvée</p>
                   </div>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL AJOUT COURS --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[3rem] p-8 border-none shadow-2xl">
          <DialogHeader className="pb-6 border-b border-slate-50">
             <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">Ajouter un cours</DialogTitle>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Filtre intelligent par affectation</p>
          </DialogHeader>

          <div className="py-6 space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Matière</label>
              <Select value={formData.matiereId} onValueChange={(v) => setFormData({...formData, matiereId: v || "", affectationId: ""})}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] uppercase tracking-tight shadow-sm">
                  <SelectValue placeholder="Sélectionner une matière..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl font-bold uppercase">
                  {availableMatieresInModal.map(m => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                         {m.nom}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Professeur</label>
              <Select disabled={!formData.matiereId} value={formData.affectationId} onValueChange={(v) => setFormData({...formData, affectationId: v || ""})}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] shadow-sm">
                  <SelectValue placeholder={formData.matiereId ? "Choisir l'enseignant..." : "Matière requise"} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl font-bold uppercase">
                  {availableAffectationsForMatiere.map(aff => (
                    <SelectItem key={aff.id} value={aff.id.toString()}>
                      {aff.enseignant?.user?.nom} {aff.enseignant?.user?.prenom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Jour</label>
                  <Select value={formData.day} onValueChange={(v) => setFormData({...formData, day: (v || "lun") as DayOfWeek})}>
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] shadow-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl font-bold">{Object.entries(DAYS_MAP).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Créneau</label>
                  <Select value={formData.hourRange} onValueChange={(v) => setFormData({...formData, hourRange: v || ""})}>
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] shadow-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl font-bold">{GRID_HOURS.filter(h => h !== "PAUSE").map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                  </Select>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Salle</label>
              <Select value={formData.room} onValueChange={(v) => setFormData({...formData, room: v || ""})}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] shadow-sm"><SelectValue placeholder="Choisir une salle..." /></SelectTrigger>
                <SelectContent className="rounded-2xl font-bold uppercase">
                  {["S. 101", "S. 102", "S. 201", "Labo 1", "Labo 2", "Terrain"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
             <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="h-12 rounded-2xl px-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Annuler</Button>
             <Button onClick={handleAddCourse} disabled={createSlotMutation.isPending || !formData.affectationId} className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 gap-2 shadow-xl shadow-emerald-900/10 transition-all active:scale-95 uppercase text-[10px] tracking-widest">
               {createSlotMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} Ajouter le cours
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL AFFECTATION --- */}
      <Dialog open={isAffModalOpen} onOpenChange={setIsAffModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[3rem] p-8 border-none shadow-2xl">
          <DialogHeader className="pb-6 border-b border-slate-50">
             <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">Affecter un Professeur</DialogTitle>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lier un prof à une matière dans cette classe</p>
          </DialogHeader>

          <div className="py-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Matière</label>
              <Select value={affData.matiereId} onValueChange={(v) => setAffData({...affData, matiereId: v || "", enseignantId: ""})}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] uppercase tracking-tight shadow-sm"><SelectValue placeholder="Choisir la matière" /></SelectTrigger>
                <SelectContent className="rounded-2xl font-bold uppercase">
                  {allMatieres.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Enseignant</label>
              <Select disabled={!affData.matiereId} value={affData.enseignantId} onValueChange={(v) => setAffData({...affData, enseignantId: v || ""})}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] uppercase shadow-sm"><SelectValue placeholder="Choisir l'enseignant" /></SelectTrigger>
                <SelectContent className="rounded-2xl font-bold uppercase">
                  {filteredEnseignantsForAff.map(e => (
                    <SelectItem key={e.id} value={e.id.toString()}>
                      {e.user?.nom} {e.user?.prenom} {e.specialites && e.specialites.length > 0 ? `(${e.specialites.join(", ")})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Coefficient</label>
              <Select value={affData.coefficient} onValueChange={(v) => setAffData({...affData, coefficient: v || ""})}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-[11px] shadow-sm"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl font-bold">
                  {["1", "2", "3", "4", "5"].map(c => <SelectItem key={c} value={c}>Coeff {c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
             <Button variant="ghost" onClick={() => setIsAffModalOpen(false)} className="h-12 rounded-2xl px-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Annuler</Button>
             <Button 
              onClick={() => createAffMutation.mutate({ classeId: parseInt(affData.classeId), matiereId: parseInt(affData.matiereId), enseignantId: parseInt(affData.enseignantId), coefficient: parseInt(affData.coefficient), noteMax: 20 })}
              disabled={createAffMutation.isPending || !affData.enseignantId || !affData.matiereId}
              className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 gap-2 shadow-xl shadow-emerald-900/10 transition-all active:scale-95 uppercase text-[10px] tracking-widest"
             >
               {createAffMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
               Affecter le Prof
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL DE CONFIRMATION DE SUPPRESSION (CENTRE & STYLISE) --- */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden">
          <div className="bg-rose-50 p-8 flex flex-col items-center justify-center text-rose-600">
             <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
             </div>
             <h3 className="text-xl font-black tracking-tight">Suppression</h3>
          </div>
          
          <div className="p-8 space-y-6">
             <div className="text-center">
                <p className="text-sm font-bold text-slate-600">Êtes-vous sûr de vouloir supprimer cette affectation ?</p>
                <p className="text-[10px] font-medium text-slate-400 mt-2 leading-relaxed">
                  Cette action est irréversible et pourrait impacter les cours déjà programmés dans l'emploi du temps.
                </p>
             </div>

             <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => deleteConfirmId && deleteAffMutation.mutate(deleteConfirmId)}
                  disabled={deleteAffMutation.isPending}
                  className="h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-200 transition-all active:scale-95"
                >
                  {deleteAffMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : "Confirmer la suppression"}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setDeleteConfirmId(null)}
                  className="h-12 rounded-xl font-black text-slate-400 uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
                >
                  Annuler
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

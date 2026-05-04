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
  Users
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
  const [selectedClasseId, setSelectedClasseId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal Form State
  const [formData, setFormData] = useState({
    day: "lun" as DayOfWeek,
    hourRange: "07h30 - 08h30",
    matiereId: "",
    enseignantId: "",
    room: ""
  });

  // 1. Fetch Classes
  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: () => ClasseService.getAll(),
    onSuccess: (data) => {
      if (data.length > 0 && !selectedClasseId) setSelectedClasseId(data[0].id.toString());
    }
  });

  // 2. Fetch Matières (Toutes)
  const { data: matieres = [] } = useQuery({
    queryKey: ["matieres"],
    queryFn: () => MatiereService.getAll()
  });

  // 3. Fetch Enseignants (Pour filtrage)
  const { data: enseignants = [] } = useQuery({
    queryKey: ["enseignants"],
    queryFn: () => EnseignantService.getAll()
  });

  // 4. Fetch Affectations (Matière-Niveau) pour récupérer le matiereNiveauId final
  const { data: affectations = [] } = useQuery({
    queryKey: ["affectations", selectedClasseId],
    queryFn: () => AffectationService.getAll(parseInt(selectedClasseId)),
    enabled: !!selectedClasseId
  });

  // 5. Fetch Créneaux
  const { data: slots = [], isLoading: isSlotsLoading } = useQuery({
    queryKey: ["creneaux", selectedClasseId],
    queryFn: () => ScheduleService.getAll(parseInt(selectedClasseId)),
    enabled: !!selectedClasseId
  });

  // Filter teachers based on selected subject
  const filteredEnseignants = useMemo(() => {
    if (!formData.matiereId) return [];
    const mat = matieres.find(m => m.id.toString() === formData.matiereId);
    if (!mat) return [];
    // Filtrer par spécialité (ou via les affectations existantes)
    return enseignants.filter(e => e.specialite === mat.nom);
  }, [formData.matiereId, matieres, enseignants]);

  // Mutation pour créer un créneau
  const createMutation = useMutation({
    mutationFn: ScheduleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creneaux"] });
      setIsModalOpen(false);
      toast.success("Cours ajouté avec succès");
    },
    onError: () => toast.error("Erreur lors de l'ajout")
  });

  const openAddModal = (dayLabel?: string, hourRange?: string) => {
    setFormData({
      day: dayLabel ? REV_DAYS_MAP[dayLabel] : "lun",
      hourRange: hourRange || "07h30 - 08h30",
      matiereId: "",
      enseignantId: "",
      room: ""
    });
    setIsModalOpen(true);
  };

  const handleAddCourse = () => {
    // Trouver le matiereNiveauId correspondant au couple Classe / Matière / Prof
    const aff = affectations.find(a => 
      a.matiereId.toString() === formData.matiereId && 
      a.enseignantId.toString() === formData.enseignantId
    );

    if (!aff) {
      toast.error("Cet enseignant n'est pas affecté à cette matière pour cette classe.");
      return;
    }

    const [start, end] = formData.hourRange.split(" - ");
    const startISO = `2024-01-01T${start.replace("h", ":")}:00.000Z`;
    const endISO = `2024-01-01T${end.replace("h", ":")}:00.000Z`;

    createMutation.mutate({
      matiereNiveauId: aff.id,
      jour: formData.day,
      heureDebut: startISO,
      heureFin: endISO,
      salle: formData.room
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      {/* --- TOP BAR --- */}
      <div className="p-4 lg:px-8 border-b border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Emplois du temps</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Année scolaire 2025-2026</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-[11px] font-bold w-48 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>
          <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center relative cursor-pointer hover:bg-white transition-all">
             <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-rose-500 rounded-full"></div>
             <Calendar size={14} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* --- ACTIONS BAR --- */}
      <div className="p-4 lg:px-8 flex flex-wrap items-center gap-3">
        <Select value={selectedClasseId} onValueChange={setSelectedClasseId}>
          <SelectTrigger className="w-44 h-9 rounded-lg border-slate-200 bg-white font-bold text-slate-700 text-xs shadow-sm">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {classes.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.nom}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg shadow-sm">
           <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md"><ChevronLeft size={16} /></Button>
           <span className="px-3 text-[9px] font-black text-slate-500 uppercase tracking-tighter">Semaine 9 (24 - 28 Fev 2026)</span>
           <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md"><ChevronRight size={16} /></Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
           <Button variant="outline" className="h-9 rounded-lg border-slate-200 gap-2 font-bold px-4 text-xs">
             <Printer size={16} /> Imprimer
           </Button>
           <Button 
            onClick={() => openAddModal()}
            className="h-9 rounded-lg bg-[#065F46] hover:bg-[#064E3B] text-white font-black px-5 text-xs gap-2 shadow-md transition-all active:scale-95"
           >
             <Plus size={18} /> Ajouter un cours
           </Button>
        </div>
      </div>

      {/* --- GRID (More Compact) --- */}
      <div className="flex-1 px-4 lg:px-8 pb-8 overflow-auto scrollbar-none">
        {isSlotsLoading ? (
          <div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>
        ) : (
          <div className="min-w-[1000px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-slate-50/50 border-b border-slate-200">
              <div className="h-10 flex items-center justify-center border-r border-slate-200">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Horaires</span>
              </div>
              {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map(day => (
                <div key={day} className="h-10 flex items-center justify-center border-r border-slate-200 last:border-0">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{day}</span>
                </div>
              ))}
            </div>

            <div className="divide-y divide-slate-100">
              {GRID_HOURS.map((hourRange) => {
                if (hourRange === "PAUSE") {
                  return (
                    <div key="pause" className="grid grid-cols-[100px_repeat(5,1fr)] h-10 bg-slate-50/20 italic text-[9px] font-bold text-slate-400">
                      <div className="flex items-center justify-center border-r border-slate-200">10h30 - 11h00</div>
                      {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map(d => (
                        <div key={d} className="flex items-center justify-center border-r border-slate-100 last:border-0">Pause</div>
                      ))}
                    </div>
                  );
                }

                return (
                  <div key={hourRange} className="grid grid-cols-[100px_repeat(5,1fr)] min-h-[85px]">
                    <div className="flex items-center justify-center border-r border-slate-200 bg-white">
                      <span className="text-[10px] font-bold text-slate-400">{hourRange}</span>
                    </div>
                    {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map(dayLabel => {
                      const dayKey = REV_DAYS_MAP[dayLabel];
                      const slot = slots.find(s => s.jour === dayKey && 
                        (`${s.heureDebut.split("T")[1].substring(0, 5).replace(":", "h")} - ${s.heureFin.split("T")[1].substring(0, 5).replace(":", "h")}` === hourRange.replace("07", "7").replace("08", "8").replace("09", "9"))
                      );
                      
                      return (
                        <div key={`${dayLabel}-${hourRange}`} className="relative p-1.5 border-r border-slate-100 last:border-0 group">
                          {slot ? (
                            <div className={cn(
                              "absolute inset-1.5 rounded-xl border p-2.5 flex flex-col justify-between shadow-sm transition-all cursor-pointer hover:scale-[1.02]",
                              COLORS_PALETTE[slot.id % COLORS_PALETTE.length]
                            )}>
                               <div>
                                 <h4 className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{slot.matiereNiveau?.matiere?.nom}</h4>
                                 <p className="text-[9px] font-bold opacity-80 mt-0.5">{slot.matiereNiveau?.enseignant?.user?.nom}</p>
                               </div>
                               <div className="flex items-center justify-between text-[8px] font-black opacity-60">
                                 <span>{slot.salle}</span>
                                 <X size={10} className="opacity-0 group-hover:opacity-100 hover:text-rose-600 transition-opacity" onClick={(e) => {
                                    e.stopPropagation();
                                    ScheduleService.delete(slot.id).then(() => queryClient.invalidateQueries({queryKey:["creneaux"]}));
                                 }} />
                               </div>
                            </div>
                          ) : (
                            <div 
                              onClick={() => openAddModal(dayLabel, hourRange)}
                              className="absolute inset-1.5 border border-dashed border-slate-100 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:bg-emerald-50/30 hover:border-emerald-200 group/btn"
                            >
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
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* --- ADD MODAL (Compact & Logic corrected) --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 border-none shadow-2xl">
          <DialogHeader className="pb-4 border-b border-slate-50">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Plus size={20} />
               </div>
               <div>
                  <DialogTitle className="text-lg font-black text-slate-900">Ajouter un cours</DialogTitle>
                  <p className="text-[10px] font-medium text-slate-400">Remplissez les informations pour le nouveau cours.</p>
               </div>
            </div>
          </DialogHeader>

          <div className="py-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Jour */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  <Calendar size={12} /> Jour
                </label>
                <Select value={formData.day} onValueChange={(v) => setFormData({...formData, day: v as DayOfWeek})}>
                  <SelectTrigger className="h-10 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl font-bold">
                    {Object.entries(DAYS_MAP).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Creneau */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  <Clock size={12} /> Creneau horaire
                </label>
                <Select value={formData.hourRange} onValueChange={(v) => setFormData({...formData, hourRange: v})}>
                  <SelectTrigger className="h-10 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl font-bold">
                    {GRID_HOURS.filter(h => h !== "PAUSE").map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Matière */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                 <BookOpen size={12} /> Matiere
              </label>
              <Select value={formData.matiereId} onValueChange={(v) => setFormData({...formData, matiereId: v, enseignantId: ""})}>
                <SelectTrigger className="h-10 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs">
                  <SelectValue placeholder="Sélectionner une matière..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  {matieres.map(m => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full" style={{ backgroundColor: m.couleur || "#10b981" }}></div>
                         {m.nom}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Professeur */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                <Users size={12} /> Professeur
              </label>
              <Select 
                disabled={!formData.matiereId} 
                value={formData.enseignantId} 
                onValueChange={(v) => setFormData({...formData, enseignantId: v})}
              >
                <SelectTrigger className="h-10 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs">
                  <SelectValue placeholder={formData.matiereId ? "Sélectionner un enseignant..." : "Choisir une matière"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  {filteredEnseignants.map(e => (
                    <SelectItem key={e.id} value={e.id.toString()}>
                      {e.user?.nom} {e.user?.prenom}
                    </SelectItem>
                  ))}
                  {filteredEnseignants.length === 0 && formData.matiereId && (
                    <div className="p-2 text-[10px] text-slate-400 italic">Aucun prof pour cette matière</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Salle */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                 <MapPin size={12} /> Salle
              </label>
              <Select value={formData.room} onValueChange={(v) => setFormData({...formData, room: v})}>
                <SelectTrigger className="h-10 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs">
                  <SelectValue placeholder="Sélectionner une salle..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  {["Salle 101", "Salle 102", "Labo 1", "Labo 2", "Terrain"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
             <Button 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
              className="h-10 rounded-xl px-4 font-bold text-slate-400 text-xs"
             >
               Annuler
             </Button>
             <Button 
              onClick={handleAddCourse}
              disabled={createMutation.isPending || !formData.enseignantId}
              className="h-10 rounded-xl bg-[#67A68C] hover:bg-[#5a927a] text-white font-black px-6 gap-2 shadow-lg shadow-emerald-900/10 transition-all"
             >
               {createMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
               Ajouter le cours
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

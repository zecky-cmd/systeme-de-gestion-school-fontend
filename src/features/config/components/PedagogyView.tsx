import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, Save, X, 
  AlertCircle, ChevronUp, ChevronDown, Check
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SubjectCoefficient, NoteType } from "@/services/pedagogy.service";
import { Matiere } from "@/services/matiere.service";

interface PedagogyViewProps {
  subjects: SubjectCoefficient[];
  levels: string[];
  noteTypes: NoteType[];
  onUpdateCoefficients: (subjects: SubjectCoefficient[]) => void;
  onUpdateNoteTypes: (noteTypes: NoteType[]) => void;
  onCreateSubject: (data: any) => void;
  onUpdateSubject: (id: number, data: Partial<Matiere>) => void;
  onDeleteSubject: (id: number) => void;
  onCreateLevel: (data: { nom: string, cycle: "col" | "lyc" }) => void;
  onDeleteLevel: (level: string) => void;
  isSaving: boolean;
}

const GROUPS = ["Sciences", "Lettres", "Langues", "Sport", "Arts"];

const NOTE_TYPE_STYLES: Record<string, string> = {
  "DS": "bg-blue-50/50 border-blue-100 text-blue-700",
  "Devoir Surveille (DS)": "bg-blue-50/50 border-blue-100 text-blue-700",
  "Interrogation": "bg-amber-50/50 border-amber-100 text-amber-700",
  "Composition": "bg-emerald-50/50 border-emerald-100 text-emerald-700",
  "Examen blanc": "bg-rose-50/50 border-rose-100 text-rose-700",
};

// Custom Stepper Component for Coefficients
const CoefStepper = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => (
  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 group-hover:border-emerald-200 transition-all">
    <div className="flex-1 text-center font-bold text-slate-700 min-w-[24px]">
      {value}
    </div>
    <div className="flex flex-col border-l border-slate-100 pl-1">
      <button 
        onClick={(e) => { e.stopPropagation(); onChange(Math.min(9, value + 1)); }}
        className="p-0.5 hover:text-emerald-600 transition-colors"
      >
        <ChevronUp size={12} />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onChange(Math.max(0, value - 1)); }}
        className="p-0.5 hover:text-emerald-600 transition-colors"
      >
        <ChevronDown size={12} />
      </button>
    </div>
  </div>
);

export function PedagogyView({ 
  subjects: initialSubjects = [], 
  levels = [],
  noteTypes: initialNoteTypes = [],
  onUpdateCoefficients,
  onUpdateNoteTypes,
  onCreateSubject,
  onUpdateSubject,
  onDeleteSubject,
  onCreateLevel,
  onDeleteLevel,
  isSaving
}: PedagogyViewProps) {
  const [localSubjects, setLocalSubjects] = useState<SubjectCoefficient[]>(initialSubjects || []);
  const [localNoteTypes, setLocalNoteTypes] = useState<NoteType[]>(initialNoteTypes || []);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isCoefModalOpen, setIsCoefModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCoefficient | null>(null);
  const [selectedNoteType, setSelectedNoteType] = useState<NoteType | null>(null);
  
  const [formData, setFormData] = useState<{
    nom: string;
    code: string;
    cycle: "col" | "lyc" | "tous";
    groupe: string;
    coefficients: Record<string, number>;
  }>({
    nom: "",
    code: "",
    cycle: "tous",
    groupe: "",
    coefficients: {}
  });

  const [levelData, setLevelData] = useState({
    nom: "",
    cycle: "col" as "col" | "lyc"
  });

  const [noteTypeFormData, setNoteTypeFormData] = useState({
    label: "",
    weight: 1,
    color: "emerald"
  });

  const [isNoteTypeModalOpen, setIsNoteTypeModalOpen] = useState(false);

  useEffect(() => {
    if (initialSubjects) setLocalSubjects(initialSubjects);
    if (initialNoteTypes) setLocalNoteTypes(initialNoteTypes);
  }, [initialSubjects, initialNoteTypes]);

  // Initialiser les coefficients par défaut lors de l'ouverture du modal d'ajout
  useEffect(() => {
    if (isAddModalOpen && levels) {
      const defaultCoefs: Record<string, number> = {};
      levels.forEach(l => defaultCoefs[l] = 2);
      setFormData(prev => ({ ...prev, coefficients: defaultCoefs }));
    }
  }, [isAddModalOpen, levels]);

  const handleCoefChange = (subjectId: number, level: string, value: number) => {
    setLocalSubjects(prev => prev?.map(s => {
      if (s.id === subjectId) {
        return { ...s, coefficients: { ...s.coefficients, [level]: value } };
      }
      return s;
    }) || []);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSubject(formData);
    setIsAddModalOpen(false);
  };

  const handleLevelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateLevel(levelData);
    setIsLevelModalOpen(false);
    setLevelData({ nom: "", cycle: "col" });
  };

  const handleCoefSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCoefficients(localSubjects);
    setIsCoefModalOpen(false);
    setSelectedSubject(null);
  };

  const handleNoteTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNoteType) {
      // Edit
      const updated = localNoteTypes.map(t => t.id === selectedNoteType.id ? { ...t, ...noteTypeFormData } : t);
      setLocalNoteTypes(updated);
      onUpdateNoteTypes(updated);
    } else {
      // Create
      const newType: NoteType = {
        id: Math.random().toString(36).substr(2, 9),
        ...noteTypeFormData
      };
      const updated = [...localNoteTypes, newType];
      setLocalNoteTypes(updated);
      onUpdateNoteTypes(updated);
    }
    setIsNoteTypeModalOpen(false);
    setSelectedNoteType(null);
    setNoteTypeFormData({ label: "", weight: 1, color: "emerald" });
  };

  const handleDeleteConfirm = () => {
    if (selectedSubject) {
      onDeleteSubject(selectedSubject.id);
      setIsDeleteModalOpen(false);
      setSelectedSubject(null);
    }
  };

  const openCoefModal = (subject: SubjectCoefficient) => {
    setSelectedSubject(subject);
    setIsCoefModalOpen(true);
  };

  // Group levels by cycle for display
  const collegeLevels = levels?.filter(l => l.toLowerCase().includes('6') || l.toLowerCase().includes('5') || l.toLowerCase().includes('4') || l.toLowerCase().includes('3')) || [];
  const lyceeLevels = levels?.filter(l => !collegeLevels.includes(l)) || [];

  return (
    <div className="flex flex-col gap-8">
      {/* Niveaux et classes section */}
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Niveaux et classes</CardTitle>
              <CardDescription className="text-sm">Gérez les niveaux qui apparaissent dans le tableau des coefficients</CardDescription>
            </div>
            <Button 
              onClick={() => setIsLevelModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 rounded-xl"
            >
              <Plus size={18} />
              Ajouter un niveau
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">1er Cycle</h4>
            <div className="flex flex-wrap gap-2">
              {collegeLevels.map(l => (
                <div key={l} className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold transition-all hover:border-emerald-200 hover:bg-emerald-50">
                  {l}
                  <button 
                    onClick={() => onDeleteLevel(l)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {collegeLevels.length === 0 && <span className="text-xs italic text-slate-400">Aucun niveau configuré</span>}
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">2nd Cycle</h4>
            <div className="flex flex-wrap gap-2">
              {lyceeLevels.map(l => (
                <div key={l} className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold transition-all hover:border-emerald-200 hover:bg-emerald-50">
                  {l}
                  <button 
                    onClick={() => onDeleteLevel(l)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {lyceeLevels.length === 0 && <span className="text-xs italic text-slate-400">Aucun niveau configuré</span>}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm overflow-hidden">
        <CardHeader className="pb-6 flex flex-row items-center justify-between space-y-0 bg-white border-b border-slate-50">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 font-heading">Matieres et coefficients</CardTitle>
            <CardDescription className="text-sm">Configuration pedagogique par niveau</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                setFormData({ nom: "", code: "", cycle: "tous", groupe: "", coefficients: {} });
                setIsAddModalOpen(true);
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/10 transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} />
              Ajouter une matiere
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[11px] font-bold uppercase py-4 px-6 text-slate-500">Matiere</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase text-center text-slate-500">Code</TableHead>
                  {levels?.map(level => (
                    <TableHead key={level} className="text-[11px] font-bold uppercase text-center text-slate-500">{level}</TableHead>
                  ))}
                  <TableHead className="text-[11px] font-bold uppercase text-center text-slate-500 px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localSubjects?.map((subject) => (
                  <TableRow key={subject.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors group">
                    <TableCell className="py-4 px-6 text-sm font-bold text-slate-900">
                      {subject.matiere}
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">{subject.groupe}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white text-[10px] font-bold text-slate-500 border border-slate-200">
                        {subject.code}
                      </span>
                    </TableCell>
                    {levels?.map(level => (
                      <TableCell key={level} className="text-center">
                        <div className="flex justify-center">
                          <div className={cn(
                            "h-8 w-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all",
                            (subject.coefficients?.[level] || 0) > 0 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : "bg-slate-50 text-slate-300 border border-slate-100"
                          )}>
                            {subject.coefficients?.[level] || 0}
                          </div>
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-center px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openCoefModal(subject)}
                          title="Modifier les coefficients"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedSubject(subject);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Types de notes</h3>
            <p className="text-sm text-slate-500">Définir les types d'évaluations et leur pondération par défaut</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => {
              setSelectedNoteType(null);
              setNoteTypeFormData({ label: "", weight: 1, color: "emerald" });
              setIsNoteTypeModalOpen(true);
            }}
            className="font-bold border-slate-200 hover:bg-slate-50 gap-2 rounded-xl"
          >
            <Plus size={18} />
            Ajouter un type
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {localNoteTypes?.map((type) => {
            const colorMap: Record<string, string> = {
              "blue": "bg-blue-50 border-blue-100 text-blue-700",
              "amber": "bg-amber-50 border-amber-100 text-amber-900",
              "emerald": "bg-emerald-50 border-emerald-100 text-emerald-700",
              "rose": "bg-rose-50 border-rose-100 text-rose-700",
              "red": "bg-red-50 border-red-100 text-red-700"
            };
            const style = colorMap[type.color] || "bg-white border-slate-200";
            
            return (
              <div key={type.id} className={cn("p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-all hover:shadow-md", style)}>
                <div className="space-y-1">
                  <h4 className="text-base font-bold leading-tight">{type.label}</h4>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="text-xs font-medium">Poids :</span>
                    <span className="text-sm font-black tracking-wider">x{type.weight}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedNoteType(type);
                    setNoteTypeFormData({ label: type.label, weight: type.weight, color: type.color });
                    setIsNoteTypeModalOpen(true);
                  }}
                  className="p-2 rounded-xl hover:bg-black/5 transition-all"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-3xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">Ajouter une matiere</DialogTitle>
            <DialogDescription className="text-slate-500">Configurer la matiere et ses coefficients par niveau</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Nom de la matiere</Label>
                <Input placeholder="Ex: Informatique" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="rounded-xl border-slate-200" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Code</Label>
                <Input placeholder="Ex: INFO" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="rounded-xl border-slate-200" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Groupe</Label>
                <Select value={formData.groupe} onValueChange={v => setFormData({...formData, groupe: v || ""})}>
                  <SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Choisir un groupe..." /></SelectTrigger>
                  <SelectContent>{GROUPS?.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Cycle</Label>
                <Select value={formData.cycle} onValueChange={(v: any) => setFormData({...formData, cycle: v})}>
                  <SelectTrigger className="rounded-xl border-slate-200"><SelectValue placeholder="Choisir un cycle..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="col">1er Cycle</SelectItem>
                    <SelectItem value="lyc">2nd Cycle</SelectItem>
                    <SelectItem value="tous">Tous les cycles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-700">Coefficients par niveau</Label>
              <div className="grid grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                {levels?.map(l => (
                  <div key={l} className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase text-center">{l}</div>
                    <CoefStepper 
                      value={formData.coefficients?.[l] || 0} 
                      onChange={(v) => setFormData({...formData, coefficients: {...formData.coefficients, [l]: v}})}
                    />
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="rounded-xl px-8 font-bold">Annuler</Button>
              <Button type="submit" className="bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl px-10 font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all active:scale-95">
                <Plus size={18} /> Ajouter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isLevelModalOpen} onOpenChange={setIsLevelModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">Ajouter un niveau</DialogTitle>
            <DialogDescription className="text-slate-500">Créez un nouveau niveau ou une classe (ex: 6e, 2nd C, Tle D, 1ère G1)</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLevelSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nom du niveau</Label>
              <Input 
                placeholder="Ex: 2nd C, Tle D, 1ère G1..." 
                value={levelData.nom} 
                onChange={e => setLevelData({...levelData, nom: e.target.value})} 
                className="rounded-xl border-slate-200 py-6 text-lg focus:ring-emerald-500" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cycle</Label>
              <Select value={levelData.cycle} onValueChange={(v: "col" | "lyc" | null) => { if (v) setLevelData({...levelData, cycle: v}) }}>
                <SelectTrigger className="rounded-xl border-slate-200 py-6">
                  <SelectValue placeholder="Choisir un cycle..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="col">1er Cycle</SelectItem>
                  <SelectItem value="lyc">2nd Cycle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsLevelModalOpen(false)} className="rounded-xl px-8 font-bold border border-slate-100 h-12">Annuler</Button>
              <Button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-xl px-10 font-bold h-12 shadow-lg shadow-emerald-900/10 transition-all active:scale-95">
                Ajouter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isCoefModalOpen} onOpenChange={setIsCoefModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">Modifier les coefficients</DialogTitle>
            <DialogDescription className="text-slate-500">
              Coefficients de <span className="font-bold text-slate-900">{selectedSubject?.matiere} ({selectedSubject?.code})</span> par niveau
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8 pt-6">
            <div className="flex flex-wrap gap-4 justify-center">
              {levels?.map(l => (
                <div key={l} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-bold text-slate-400">{l}</div>
                  <div className="w-16">
                    <CoefStepper 
                      value={selectedSubject?.coefficients?.[l] || 0}
                      onChange={(v) => handleCoefChange(selectedSubject!.id, l, v)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 italic">Apercu :</span>
              <div className="flex gap-2">
                {levels?.map(l => (
                  <div key={l} className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center border border-emerald-100">
                    {selectedSubject?.coefficients?.[l] || 0}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed max-w-sm mx-auto">
              Entrez 0 pour desactiver la matiere a un niveau donne. Les coefficients sont utilises pour le calcul des moyennes trimestrielles et annuelles.
            </p>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsCoefModalOpen(false)} className="rounded-xl px-8 font-bold">Annuler</Button>
              <Button onClick={handleCoefSave} className="bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl px-10 font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all active:scale-95">
                <Check size={18} /> Enregistrer
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl">
          <DialogHeader className="items-center text-center">
            <AlertCircle size={48} className="text-rose-500 mb-2" />
            <DialogTitle>Supprimer la matiere ?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Annuler</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDeleteConfirm}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNoteTypeModalOpen} onOpenChange={setIsNoteTypeModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">
              {selectedNoteType ? "Modifier le type de note" : "Ajouter un type de note"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">Définissez un type d'évaluation et sa pondération</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNoteTypeSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nom du type</Label>
              <Input 
                placeholder="Ex: Devoir Surveillé (DS)" 
                value={noteTypeFormData.label} 
                onChange={e => setNoteTypeFormData({...noteTypeFormData, label: e.target.value})} 
                className="rounded-xl border-slate-200 py-6 text-lg focus:ring-emerald-500" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Poids (coefficient multiplicateur)</Label>
              <Input 
                type="number"
                min="1"
                max="10"
                value={noteTypeFormData.weight} 
                onChange={e => setNoteTypeFormData({...noteTypeFormData, weight: parseInt(e.target.value) || 1})} 
                className="rounded-xl border-slate-200 py-6 text-lg focus:ring-emerald-500" 
                required 
              />
              <p className="text-[11px] text-slate-400">Ex: x2 signifie que cette note compte double</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Couleur</Label>
              <Select value={noteTypeFormData.color} onValueChange={(v: any) => setNoteTypeFormData({...noteTypeFormData, color: v})}>
                <SelectTrigger className="rounded-xl border-slate-200 py-6">
                  <SelectValue placeholder="Choisir une couleur..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emerald">Vert (défaut)</SelectItem>
                  <SelectItem value="amber">Jaune / Ambre</SelectItem>
                  <SelectItem value="blue">Bleu</SelectItem>
                  <SelectItem value="red">Rouge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsNoteTypeModalOpen(false)} className="rounded-xl px-8 font-bold border border-slate-100 h-12">Annuler</Button>
              <Button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-xl px-10 font-bold h-12 shadow-lg shadow-emerald-900/10 transition-all active:scale-95">
                {selectedNoteType ? "Modifier" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
import { SubjectCoefficient } from "@/services/pedagogy.service";
import { Matiere } from "@/services/matiere.service";

interface PedagogyViewProps {
  subjects: SubjectCoefficient[];
  levels: string[];
  onUpdateCoefficients: (subjects: SubjectCoefficient[]) => void;
  onCreateSubject: (data: any) => void;
  onUpdateSubject: (id: number, data: Partial<Matiere>) => void;
  onDeleteSubject: (id: number) => void;
  onCreateLevel: (data: { nom: string, cycle: "col" | "lyc" }) => void;
  onDeleteLevel: (level: string) => void;
  isSaving: boolean;
}

const GROUPS = ["Sciences", "Lettres", "Langues", "Sport", "Arts"];

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
  onUpdateCoefficients,
  onCreateSubject,
  onUpdateSubject,
  onDeleteSubject,
  onCreateLevel,
  onDeleteLevel,
  isSaving
}: PedagogyViewProps) {
  const [localSubjects, setLocalSubjects] = useState<SubjectCoefficient[]>(initialSubjects || []);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isCoefModalOpen, setIsCoefModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCoefficient | null>(null);
  
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

  useEffect(() => {
    if (initialSubjects) setLocalSubjects(initialSubjects);
  }, [initialSubjects]);

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

  const collegeLevels = levels.filter(l => ["6eme", "5eme", "4eme", "3eme"].includes(l) || l.includes("6e") || l.includes("5e") || l.includes("4e") || l.includes("3e"));
  const lyceeLevels = levels.filter(l => !collegeLevels.includes(l));

  return (
    <div className="space-y-6">
      {/* Gestion des Niveaux */}
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-slate-900 font-heading">Niveaux et classes</CardTitle>
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
        <CardContent className="space-y-6 pt-6">
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

      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 font-heading">Coefficients des matieres</CardTitle>
            <CardDescription className="text-sm">Definissez les matieres et leurs coefficients par niveau</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 rounded-xl"
            >
              <Plus size={18} />
              Ajouter une matiere
            </Button>
            <Button 
              variant="outline"
              onClick={() => onUpdateCoefficients(localSubjects)}
              disabled={isSaving}
              className="font-bold border-slate-200 hover:bg-slate-50 gap-2 rounded-xl h-10 px-6"
            >
              <Save size={18} className={cn(isSaving && "animate-spin")} />
              {isSaving ? "Enregistrement..." : "Enregistrer tout"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto overflow-y-visible">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[200px] font-bold text-slate-900 px-6">Matiere</TableHead>
                  <TableHead className="w-[100px] font-bold text-slate-900">Groupe</TableHead>
                  {levels.map(l => (
                    <TableHead key={l} className="text-center font-bold text-slate-900">{l}</TableHead>
                  ))}
                  <TableHead className="w-[120px] text-center font-bold text-slate-900 px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localSubjects.map((subject) => (
                  <TableRow key={subject.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                    <TableCell className="font-medium px-6">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-bold">{subject.matiere}</span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tight">{subject.code}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {subject.groupe}
                      </span>
                    </TableCell>
                    {levels.map(level => (
                      <TableCell key={level} className="text-center">
                        <div className="flex justify-center">
                          <div className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black transition-all",
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
    </div>
  );
}

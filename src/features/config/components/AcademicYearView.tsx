import React, { useState, useEffect } from "react";
import { Plus, Edit2, Calendar, Clock, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { AcademicYear, EvaluationPeriod } from "@/services/academic-year.service";

interface AcademicYearViewProps {
  years: AcademicYear[];
  periods: EvaluationPeriod[];
  activeYearId?: number;
  onSetActiveYear: (id: number) => void;
  onCreateYear: (data: Partial<AcademicYear>) => void;
  onUpdateYear: (id: number, data: Partial<AcademicYear>) => void;
  onCreatePeriod: (data: Partial<EvaluationPeriod>) => void;
  onUpdatePeriod: (id: number, data: Partial<EvaluationPeriod>) => void;
  isSettingActive?: boolean;
}

export function AcademicYearView({ 
  years, 
  periods, 
  activeYearId,
  onSetActiveYear,
  onCreateYear,
  onUpdateYear,
  onCreatePeriod,
  onUpdatePeriod,
  isSettingActive 
}: AcademicYearViewProps) {
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<Partial<AcademicYear> | null>(null);
  const [isPeriodDialogOpen, setIsPeriodDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Partial<EvaluationPeriod> | null>(null);


  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ouv": return "Ouverte";
      case "clos": return "Clôturée";
      case "arch": return "Archivée";
      default: return status;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ouv": return "border-green-200 bg-green-50 text-green-700";
      case "clos": return "border-border bg-secondary text-muted-foreground";
      case "arch": return "border-amber-200 bg-amber-50 text-amber-700";
      default: return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Colonne Gauche: Années scolaires */}
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 font-heading">Annees scolaires</CardTitle>
            <CardDescription className="text-sm">Gestion des annees academiques</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 px-4 gap-2 text-sm font-semibold border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            onClick={() => {
              setSelectedYear({ modeEval: "trim" });
              setIsYearDialogOpen(true);
            }}
          >
            <Plus size={18} /> Nouvelle annee
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {years.map((year) => (
            <div 
              key={year.id} 
              className={cn(
                "relative overflow-hidden p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer",
                year.id === activeYearId 
                  ? "border-emerald-500/30 bg-emerald-50/60 shadow-md ring-1 ring-emerald-500/10" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              )}
            >
              {/* Barre d'accentuation pour l'année active */}
              {year.id === activeYearId && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
              )}

              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                  year.id === activeYearId 
                    ? "bg-emerald-500 text-white scale-105 shadow-emerald-200" 
                    : "bg-slate-100 text-slate-400"
                )}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-base font-bold leading-none transition-colors",
                      year.id === activeYearId ? "text-emerald-900" : "text-slate-900"
                    )}>
                      {year.libelle}
                    </span>
                    {year.id === activeYearId ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
                        Année en cours
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-[10px] font-bold gap-1 opacity-0 group-hover:opacity-100 transition-all border-slate-200 text-slate-500 hover:bg-slate-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetActiveYear(year.id);
                        }}
                        disabled={isSettingActive}
                      >
                        Activer
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      {new Date(year.dateDebut).toLocaleDateString()} - {new Date(year.dateFin).toLocaleDateString()}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold capitalize">
                      {year.modeEval === 'trim' ? 'Trimestrielle' : 'Semestrielle'}
                    </span>
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-white transition-all shadow-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedYear(year);
                  setIsYearDialogOpen(true);
                }}
              >
                <Edit2 size={16} />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
          
      <div className="flex flex-col gap-6">
        {/* Périodes d'évaluation */}
        <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold text-slate-900 font-heading">Périodes d'évaluation</CardTitle>
              <CardDescription className="text-xs">Trimestres / Semestres</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="trim">
                <SelectTrigger className="w-[120px] h-8 rounded-md border-slate-200 text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="trim" className="text-xs font-medium">Trimestrielle</SelectItem>
                  <SelectItem value="sem" className="text-xs font-medium">Semestrielle</SelectItem>
                </SelectContent>
              </Select>
              <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90 text-white rounded-md shadow-sm transition-all active:scale-95">
                <Save size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {periods.map((period) => (
              <div key={period.id} className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between group bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-md flex items-center justify-center shadow-sm bg-slate-100 text-slate-400"
                  )}>
                    <Clock size={14} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900">{period.libelle}</span>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {new Date(period.dateDebut).toLocaleDateString()} - {new Date(period.dateFin).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn(
                    "text-[9px] font-bold border px-2 h-4",
                    getStatusBadgeClass(period.statut)
                  )}>
                    {getStatusLabel(period.statut)}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-slate-400 hover:text-primary transition-colors"
                    onClick={() => {
                      setSelectedPeriod(period);
                      setIsPeriodDialogOpen(true);
                    }}
                  >
                    <Edit2 size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Dialog Création/Édition Année */}
      <Dialog open={isYearDialogOpen} onOpenChange={setIsYearDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedYear?.id ? "Modifier l'année scolaire" : "Nouvelle année scolaire"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="libelle">Libellé (ex: 2025-2026)</Label>
              <Input 
                id="libelle" 
                value={selectedYear?.libelle || ""} 
                onChange={(e) => setSelectedYear(prev => ({ ...prev, libelle: e.target.value }))}
                placeholder="2025-2026"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dateDebut">Date début</Label>
                <Input 
                  id="dateDebut" 
                  type="date"
                  value={selectedYear?.dateDebut?.split('T')[0] || ""} 
                  onChange={(e) => setSelectedYear(prev => ({ ...prev, dateDebut: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateFin">Date fin</Label>
                <Input 
                  id="dateFin" 
                  type="date"
                  value={selectedYear?.dateFin?.split('T')[0] || ""} 
                  onChange={(e) => setSelectedYear(prev => ({ ...prev, dateFin: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="modeEval">Mode d'évaluation</Label>
              <Select 
                value={selectedYear?.modeEval || "trim"}
                onValueChange={(v) => setSelectedYear(prev => ({ ...prev, modeEval: v as "trim" | "sem" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trim">Trimestriel (3 périodes)</SelectItem>
                  <SelectItem value="sem">Semestriel (2 périodes)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsYearDialogOpen(false)}>Annuler</Button>
            <Button 
              onClick={() => {
                if (selectedYear?.id) {
                  onUpdateYear(selectedYear.id, selectedYear);
                } else {
                  onCreateYear(selectedYear || {});
                }
                setIsYearDialogOpen(false);
              }}
              disabled={!selectedYear?.libelle || !selectedYear?.dateDebut || !selectedYear?.dateFin}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog Édition Période */}
      <Dialog open={isPeriodDialogOpen} onOpenChange={setIsPeriodDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la période</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="p-libelle">Libellé</Label>
              <Input 
                id="p-libelle" 
                value={selectedPeriod?.libelle || ""} 
                onChange={(e) => setSelectedPeriod(prev => ({ ...prev, libelle: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="p-dateDebut">Date début</Label>
                <Input 
                  id="p-dateDebut" 
                  type="date"
                  value={selectedPeriod?.dateDebut?.split('T')[0] || ""} 
                  onChange={(e) => setSelectedPeriod(prev => ({ ...prev, dateDebut: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-dateFin">Date fin</Label>
                <Input 
                  id="p-dateFin" 
                  type="date"
                  value={selectedPeriod?.dateFin?.split('T')[0] || ""} 
                  onChange={(e) => setSelectedPeriod(prev => ({ ...prev, dateFin: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-statut">Statut</Label>
              <Select 
                value={selectedPeriod?.statut || "ouv"}
                onValueChange={(v) => setSelectedPeriod(prev => ({ ...prev, statut: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ouv">Ouverte</SelectItem>
                  <SelectItem value="clos">Clôturée</SelectItem>
                  <SelectItem value="arch">Archivée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPeriodDialogOpen(false)}>Annuler</Button>
            <Button 
              onClick={() => {
                if (selectedPeriod?.id) {
                  onUpdatePeriod(selectedPeriod.id, selectedPeriod);
                }
                setIsPeriodDialogOpen(false);
              }}
              disabled={!selectedPeriod?.libelle}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

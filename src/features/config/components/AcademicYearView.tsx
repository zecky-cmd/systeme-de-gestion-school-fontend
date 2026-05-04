import React from "react";
import { Plus, Edit2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AcademicYear, EvaluationPeriod, SchoolSeries } from "@/services/academic-year.service";

interface AcademicYearViewProps {
  years: AcademicYear[];
  periods: EvaluationPeriod[];
  series: SchoolSeries[];
  onToggleSeries: (id: string, isActive: boolean) => void;
}

export function AcademicYearView({ years, periods, series, onToggleSeries }: AcademicYearViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Colonne Gauche: Années scolaires */}
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">Années scolaires</CardTitle>
            <CardDescription className="text-xs">Gestion des années académiques</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[10px] font-semibold border-slate-200">
            <Plus size={14} /> Nouvelle année
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {years.map((year) => (
            <div 
              key={year.id} 
              className={cn(
                "p-3 rounded-lg border transition-all flex items-center justify-between group cursor-pointer",
                year.isActive 
                  ? "border-primary/30 bg-primary/5" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shadow-sm",
                  year.isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                )}>
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{year.label}</span>
                    {year.isActive && (
                      <Badge className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 h-4 border-none">Active</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {year.startDate} - {year.endDate}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-primary">
                <Edit2 size={12} />
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
              <CardTitle className="text-sm font-semibold">Périodes d'évaluation</CardTitle>
              <CardDescription className="text-xs">Trimestres / Semestres</CardDescription>
            </div>
            <Select defaultValue="Trimestrielle">
              <SelectTrigger className="w-[120px] h-8 rounded-md border-slate-200 text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                <SelectItem value="Trimestrielle" className="text-xs">Trimestrielle</SelectItem>
                <SelectItem value="Semestrielle" className="text-xs">Semestrielle</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-2">
            {periods.map((period) => (
              <div key={period.id} className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between group bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-md flex items-center justify-center shadow-sm",
                    period.status === "Ouverte" ? "bg-green-100 text-green-600" :
                    period.status === "Cloturee" ? "bg-secondary text-muted-foreground" : "bg-amber-100 text-amber-600"
                  )}>
                    <Clock size={14} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900">{period.label}</span>
                    <p className="text-[11px] text-muted-foreground">{period.startDate} - {period.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn(
                    "text-[9px] font-bold border px-2 h-4",
                    period.status === "Ouverte" ? "border-green-200 bg-green-50 text-green-700" :
                    period.status === "Cloturee" ? "border-border bg-secondary text-muted-foreground" : "border-amber-200 bg-amber-50 text-amber-700"
                  )}>
                    {period.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                    <Edit2 size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Séries du lycée */}
        <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Séries du lycée</CardTitle>
            <CardDescription className="text-xs">Activez les séries proposées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {series.map((s) => (
                <div key={s.id} className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-6 px-1.5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold border",
                      s.isActive ? "bg-primary/10 border-primary/20 text-primary" : "bg-white border-slate-200 text-slate-400"
                    )}>
                      {s.id}
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 truncate max-w-[100px]">{s.label}</span>
                  </div>
                  <Switch 
                    checked={s.isActive} 
                    onCheckedChange={(checked) => onToggleSeries(s.id, checked)}
                    className="scale-75"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

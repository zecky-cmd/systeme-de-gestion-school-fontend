import React from "react";
import { Edit2, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { EvaluationPeriod } from "@/services/academic-year.service";
import { getStatusLabel, getStatusBadgeClass } from "./utils";

interface PeriodsCardProps {
  periods: EvaluationPeriod[];
  onEditClick: (period: EvaluationPeriod) => void;
  modeEval?: "trim" | "sem";
}

export function PeriodsCard({
  periods,
  onEditClick,
  modeEval = "trim"
}: PeriodsCardProps) {
  return (
    <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold text-slate-900 font-heading">Périodes d'évaluation</CardTitle>
          <CardDescription className="text-xs">Trimestres / Semestres</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={modeEval}>
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
                onClick={() => onEditClick(period)}
              >
                <Edit2 size={12} />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

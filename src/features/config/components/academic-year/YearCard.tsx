import React from "react";
import { Plus, Edit2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AcademicYear } from "@/services/academic-year.service";

interface YearCardProps {
  years: AcademicYear[];
  activeYearId?: number;
  onSetActiveYear: (id: number) => void;
  onAddClick: () => void;
  onEditClick: (year: AcademicYear) => void;
  isSettingActive?: boolean;
}

export function YearCard({
  years,
  activeYearId,
  onSetActiveYear,
  onAddClick,
  onEditClick,
  isSettingActive
}: YearCardProps) {
  return (
    <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-slate-900 font-heading">Années scolaires</CardTitle>
          <CardDescription className="text-sm">Gestion des années académiques</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 px-4 gap-2 text-sm font-semibold border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
          onClick={onAddClick}
        >
          <Plus size={18} /> Nouvelle année
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
                onEditClick(year);
              }}
            >
              <Edit2 size={16} />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

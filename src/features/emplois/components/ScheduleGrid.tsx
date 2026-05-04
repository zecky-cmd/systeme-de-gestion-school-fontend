import React from "react";
import { Users, MapPin, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { GRID_HOURS, REV_DAYS_MAP, COLORS_PALETTE } from "../constants/schedule.constants";

interface ScheduleGridProps {
  slots: any[];
  onAddCourse: (dayLabel: string, hourRange: string) => void;
  onDeleteCourse: (id: number) => void;
}

export function ScheduleGrid({ slots, onAddCourse, onDeleteCourse }: ScheduleGridProps) {
  return (
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
                  const slot = slots.find(s => 
                    s.jour === REV_DAYS_MAP[dayLabel] && 
                    hourRange.includes(s.heureDebut.split("T")[1].substring(0, 5).replace(":", "h"))
                  );
                  
                  return (
                    <div key={`${dayLabel}-${hourRange}`} className="relative p-2 border-r border-slate-100 last:border-0 group">
                      {hourRange === "PAUSE" ? (
                        <div className="flex items-center justify-center h-full text-[9px] font-bold text-slate-300 italic uppercase tracking-widest">Pause</div>
                      ) : slot ? (
                        <div className={cn(
                          "absolute inset-2 rounded-2xl border-2 p-3 flex flex-col justify-between shadow-sm transition-all hover:scale-[1.02]", 
                          COLORS_PALETTE[slot.id % COLORS_PALETTE.length]
                        )}>
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{slot.matiereNiveau?.matiere?.nom}</h4>
                            <p className="text-[9px] font-bold opacity-80 mt-1 flex items-center gap-1">
                               <Users size={10} className="opacity-50" /> {slot.matiereNiveau?.enseignant?.user?.nom}
                            </p>
                          </div>
                          <div className="text-[9px] font-black opacity-60 flex justify-between items-center">
                            <span className="flex items-center gap-1"><MapPin size={10} /> {slot.salle}</span>
                            <X 
                              size={12} 
                              className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-rose-500 transition-all" 
                              onClick={() => onDeleteCourse(slot.id)} 
                            />
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => onAddCourse(dayLabel, hourRange)} 
                          className="absolute inset-2 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-emerald-50/30 transition-all group/btn"
                        >
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
  );
}

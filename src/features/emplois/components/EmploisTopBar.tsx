import React from "react";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface EmploisTopBarProps {
  activeTab: "planning" | "affectations";
  setActiveTab: (tab: "planning" | "affectations") => void;
  selectedClasseId: string;
  setSelectedClasseId: (id: string) => void;
  classes: any[];
}

export function EmploisTopBar({ 
  activeTab, 
  setActiveTab, 
  selectedClasseId, 
  setSelectedClasseId, 
  classes 
}: EmploisTopBarProps) {
  return (
    <div className="p-4 lg:px-8 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm relative z-10">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Emplois du temps</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Année scolaire 2025-2026</p>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
           <button 
            onClick={() => setActiveTab("planning")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all", 
              activeTab === "planning" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
           >
             Planning
           </button>
           <button 
            onClick={() => setActiveTab("affectations")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all", 
              activeTab === "affectations" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
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
  );
}

"use client";

import React from "react";
import { Search, Filter, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ClassesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  cycleFilter: string;
  onCycleChange: (value: string) => void;
}

export function ClassesFilters({ 
  search, 
  onSearchChange, 
  cycleFilter, 
  onCycleChange 
}: ClassesFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 backdrop-blur-md shadow-sm">
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
        <Input 
          placeholder="Rechercher une classe ou un niveau..." 
          className="pl-10 h-10 bg-transparent border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20 font-bold text-sm rounded-xl"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <Select 
            value={cycleFilter} 
            onValueChange={(val) => onCycleChange(val || "all")}
          >
            <SelectTrigger className="w-[140px] h-10 font-bold border-slate-200 dark:border-slate-800 bg-transparent rounded-xl">
              <SelectValue placeholder="Tous les cycles" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800">
              <SelectItem value="all" className="text-xs font-medium">Tous les cycles</SelectItem>
              <SelectItem value="col" className="text-xs font-medium uppercase font-bold text-blue-600">Collège</SelectItem>
              <SelectItem value="lyc" className="text-xs font-medium uppercase font-bold text-emerald-600">Lycée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
           <LayoutGrid size={18} />
        </Button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClassesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function ClassesFilters({ 
  search, 
  onSearchChange, 
}: ClassesFiltersProps) {
  return (
    <div className="flex items-center gap-3 w-full bg-white dark:bg-slate-950 p-1.5 pl-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
      <Search className="h-4 w-4 text-slate-400 shrink-0" />
      <Input 
        placeholder="Rechercher par classe, niveau ou série..." 
        className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-9 font-bold text-sm placeholder:text-slate-400 placeholder:font-medium p-0"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="h-6 w-px bg-slate-100 dark:bg-slate-800 shrink-0" />
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-9 px-3 gap-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
      >
        <SlidersHorizontal size={14} />
        Filtres
      </Button>
    </div>
  );
}

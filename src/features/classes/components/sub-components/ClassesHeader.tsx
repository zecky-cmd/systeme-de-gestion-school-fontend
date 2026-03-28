"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Download, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

interface ClassesHeaderProps {
  onAdd: () => void;
  onRefresh: () => void;
  isFetching: boolean;
}

export function ClassesHeader({ onAdd, onRefresh, isFetching }: ClassesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <LayoutGrid size={18} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gestion Académique</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Organisation des <span className="text-emerald-600">Classes</span>
        </h1>
        <p className="text-xs font-bold text-slate-400 max-w-md">
          Gérez les sections, surveillez le remplissage et optimisez l'affectation des élèves par cycle et niveau.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="h-9 px-3 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm"
          disabled={isFetching}
        >
          <RefreshCw className={isFetching ? "animate-spin h-3.5 w-3.5 text-emerald-600" : "h-3.5 w-3.5 text-slate-400"} />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 gap-2 text-xs font-black border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm"
        >
          <Download size={14} className="text-slate-400" />
          EXPORTER
        </Button>
        <Button 
          onClick={onAdd}
          className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 gap-2 border-0 transition-all active:scale-95"
        >
          <Plus size={16} strokeWidth={3} />
          NOUVELLE CLASSE
        </Button>
      </div>
    </div>
  );
}

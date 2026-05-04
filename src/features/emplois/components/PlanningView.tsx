import React from "react";
import { motion } from "framer-motion";
import { Printer, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleGrid } from "./ScheduleGrid";
import { usePrintSchedule } from "../hooks/usePrintSchedule";

interface PlanningViewProps {
  selectedClasseName: string;
  slots: any[];
  onAddCourse: (dayLabel?: string, hourRange?: string) => void;
  onDeleteCourse: (id: number) => void;
}

export function PlanningView({ selectedClasseName, slots, onAddCourse, onDeleteCourse }: PlanningViewProps) {
  const { printRef, handlePrint } = usePrintSchedule();

  return (
    <motion.div 
      key="planning"
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Titre Impression */}
      <div className="hidden print:block text-center pb-8 border-b-2 border-slate-900 mb-8">
         <h1 className="text-3xl font-black uppercase tracking-tighter">Emploi du Temps</h1>
         <p className="text-xl font-bold text-slate-600 mt-2">Classe : {selectedClasseName}</p>
         <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest">Année Scolaire 2025-2026</p>
      </div>

      {/* Actions Bar */}
      <div className="p-4 lg:px-8 flex items-center justify-between print:hidden">
         <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <ChevronLeft size={16} />
            </Button>
            <span className="px-3 text-[10px] font-black text-slate-500 uppercase">Semaine 9</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <ChevronRight size={16} />
            </Button>
         </div>
         <div className="flex items-center gap-2">
            <Button 
              onClick={handlePrint}
              variant="outline" 
              className="h-10 rounded-xl border-slate-200 font-bold px-4 text-xs gap-2"
            >
              <Printer size={16} /> Imprimer
            </Button>
            <Button 
              onClick={() => onAddCourse()} 
              className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 text-xs gap-2 shadow-lg shadow-emerald-500/20 uppercase tracking-widest"
            >
              <Plus size={18} /> Ajouter un cours
            </Button>
         </div>
      </div>

      <ScheduleGrid 
        ref={printRef}
        slots={slots} 
        onAddCourse={onAddCourse} 
        onDeleteCourse={onDeleteCourse} 
      />
    </motion.div>
  );
}

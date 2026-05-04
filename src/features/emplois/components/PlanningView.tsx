import React from "react";
import { motion } from "framer-motion";
import { Printer, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleGrid } from "./ScheduleGrid";

interface PlanningViewProps {
  slots: any[];
  onAddCourse: (dayLabel?: string, hourRange?: string) => void;
  onDeleteCourse: (id: number) => void;
}

export function PlanningView({ slots, onAddCourse, onDeleteCourse }: PlanningViewProps) {
  return (
    <motion.div 
      key="planning"
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Actions Bar */}
      <div className="p-4 lg:px-8 flex items-center justify-between">
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
            <Button variant="outline" className="h-10 rounded-xl border-slate-200 font-bold px-4 text-xs gap-2">
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
        slots={slots} 
        onAddCourse={onAddCourse} 
        onDeleteCourse={onDeleteCourse} 
      />
    </motion.div>
  );
}

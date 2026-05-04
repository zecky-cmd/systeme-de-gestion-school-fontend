import React from "react";
import { motion } from "framer-motion";
import { Plus, BookOpen, Users, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AffectationsViewProps {
  affectations: any[];
  isLoading: boolean;
  onOpenAddModal: () => void;
  onDeleteRequest: (id: number) => void;
}

export function AffectationsView({ 
  affectations, 
  isLoading, 
  onOpenAddModal, 
  onDeleteRequest 
}: AffectationsViewProps) {
  return (
    <motion.div 
      key="affectations"
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 p-8 overflow-auto scrollbar-none"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
           <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Affectations de la classe</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lier les professeurs aux matières</p>
           </div>
           <Button 
            onClick={onOpenAddModal} 
            className="rounded-2xl bg-[#065F46] hover:bg-[#054a37] text-white font-black px-8 h-12 shadow-lg shadow-emerald-500/20 gap-3"
           >
              <Plus size={18} /> Affecter un Prof
           </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {affectations.map(aff => (
             <div key={aff.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-emerald-500 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <BookOpen size={24} />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{aff.matiere?.nom}</h4>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                         <Users size={12} className="opacity-50" /> {aff.enseignant?.user?.nom} {aff.enseignant?.user?.prenom}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-md uppercase tracking-widest">Coeff {aff.coefficient}</div>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDeleteRequest(aff.id)}
                    className="text-rose-300 hover:text-rose-600 hover:bg-rose-50 h-10 w-10 rounded-xl transition-all"
                   >
                      <Trash2 size={18} />
                   </Button>
                </div>
             </div>
           ))}
           {affectations.length === 0 && !isLoading && (
             <div className="col-span-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 gap-2">
                <AlertCircle size={32} className="opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest">Aucune affectation trouvée</p>
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}

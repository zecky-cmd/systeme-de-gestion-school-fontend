"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hammer, HardHat, Construction, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UnderConstructionProps {
  title?: string;
  description?: string;
}

export function UnderConstruction({ 
  title = "Page en cours de construction", 
  description = "Nos équipes travaillent dur pour vous offrir une expérience académique et financière exceptionnelle. Revenez bientôt !" 
}: UnderConstructionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut"
        }}
        className="relative mb-12"
      >
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/10">
          <div className="flex items-center justify-center gap-4">
             <motion.div
               animate={{ rotate: [0, 10, 0, -10, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             >
               <HardHat className="h-16 w-16 text-emerald-600 drop-shadow-sm" />
             </motion.div>
             <motion.div
               animate={{ y: [0, -5, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
             >
               <Hammer className="h-12 w-12 text-amber-500 drop-shadow-sm" />
             </motion.div>
          </div>
        </div>
        
        <div className="absolute -bottom-4 -right-4 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-lg">
           <Construction className="h-6 w-6 text-amber-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-md space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
           <span className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
           <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600/70">Building Excellence</span>
           <span className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {title}
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
          {description}
        </p>

        <div className="pt-8">
           <Card className="border-none bg-slate-50 dark:bg-slate-900/50 shadow-inner rounded-3xl overflow-hidden group">
              <CardContent className="p-6 flex items-center justify-center gap-6">
                 <div className="text-left space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Estimation de livraison</p>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-300">Prochaines semaines</p>
                 </div>
                 <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 group-hover:scale-105 transition-transform cursor-pointer">
                    <Clock size={16} className="text-emerald-600" />
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase">Alerte Bientôt</span>
                 </div>
              </CardContent>
           </Card>
        </div>
      </motion.div>
    </div>
  );
}

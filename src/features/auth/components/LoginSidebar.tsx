"use client";

import { motion } from "framer-motion";
import { 
  BookMarked, 
  Users,
  GraduationCap,
  ShieldCheck,
  Globe
} from "lucide-react";

const STATS = [
  { label: "Élèves inscrits", value: "1 247", icon: Users },
  { label: "Enseignants", value: "48", icon: GraduationCap },
  { label: "Classes", value: "38", icon: ShieldCheck },
  { label: "Disponibilité", value: "99%", icon: Globe },
];

export function LoginSidebar() {
  return (
    <div className="hidden lg:flex flex-col relative w-1/2 bg-[#020817] p-12 text-white overflow-hidden">
      {/* Cercles décoratifs en arrière-plan */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center gap-3"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
          <BookMarked className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">EduManager CI</h1>
          <p className="text-xs text-slate-400">Système de Gestion Scolaire</p>
        </div>
      </motion.div>

      <div className="mt-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl xl:text-5xl font-bold leading-tight"
        >
          La gestion scolaire <span className="text-emerald-500">simplifiée</span> <br />
          pour la Côte d'Ivoire
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-slate-400 text-lg max-w-md leading-relaxed"
        >
          Inscriptions, bulletins de notes, paiements, emplois du temps et portail parents : 
          tout est centralisé dans une seule plateforme moderne et sécurisée.
        </motion.p>

        <div className="mt-12 grid grid-cols-2 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-emerald-500">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="mt-auto pt-12 relative z-10"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">
          République de Côte d'Ivoire — Union - Discipline - Travail
        </p>
      </motion.div>
    </div>
  );
}

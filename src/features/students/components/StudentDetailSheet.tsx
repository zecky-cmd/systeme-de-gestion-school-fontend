"use client";

import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Flag, User, GraduationCap, CreditCard, Mail, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

interface StudentDetailSheetProps {
  student: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (student: any) => void;
}

export function StudentDetailSheet({ student, open, onOpenChange, onEdit }: StudentDetailSheetProps) {
  if (!student) return null;

  const nom = student.nom || student.user?.nom || "Non renseigné";
  const prenom = student.prenom || student.user?.prenom || "";
  const fullNom = `${nom} ${prenom}`;
  const email = student.email || student.user?.email || "Pas d'email";
  const photoUrl = student.photoUrl || student.user?.photoUrl;
  const initials = nom.substring(0, 1) + (prenom.substring(0, 1) || "");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md p-0 overflow-hidden flex flex-col border-l-0 shadow-2xl">
        {/* Header avec Background Stylisé */}
        <div className="relative h-32 bg-emerald-600 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/50 to-emerald-900/50" />
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-950 overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center shadow-xl ring-1 ring-black/5">
              {photoUrl ? (
                <img src={photoUrl} alt={fullNom} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-emerald-600 uppercase">{initials}</span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <StatusBadge status={student.statut || "Inscrit"} className="shadow-lg border-2 border-white dark:border-slate-950" />
            </div>
          </div>
        </div>

        <div className="mt-14 px-6 pb-4 flex-1 overflow-y-auto space-y-8 scrollbar-none">
          {/* Titre et Identité Rapide */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">{fullNom}</h2>
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/50">
                Matricule: {student.matricule || "N/A"}
              </span>
            </div>
          </div>

          {/* Section: Informations Personnelles */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
              <User size={12} className="text-emerald-500" />
              Dossier Civil
            </h3>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="space-y-1.5">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Genre / Sexe</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{student.sexe === "M" ? "Masculin" : "Féminin"}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Origine / Nationalité</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <Flag size={14} className="text-slate-300" />
                  {student.nationalite || "Ivoirienne"}
                </div>
              </div>
              <div className="space-y-1.5 col-span-2">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Contact Principal (Email)</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <Mail size={14} className="text-slate-300" />
                  {email}
                </div>
              </div>
              <div className="space-y-1.5 col-span-2 border-t pt-3 mt-1">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Naissance & Lieu</p>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-300" />
                    {student.dateNaissance ? new Date(student.dateNaissance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : "Date inconnue"}
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-300" />
                    {student.lieuNaissance || "Lieu non renseigné"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Scolarité & Classe */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
              <GraduationCap size={12} className="text-emerald-500" />
              Scolarité
            </h3>
            
            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                <GraduationCap size={60} className="text-emerald-600" />
              </div>
              <div className="relative z-10 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[9px] text-emerald-600/60 font-black uppercase tracking-widest">Classe Actuelle</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-white leading-tight">
                    {student.classe?.nom || "Non affecté"}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-emerald-600 text-white border-0 shadow-md shadow-emerald-600/20 text-[10px] font-bold h-6">
                  Année 2025-2026
                </Badge>
              </div>
            </div>
          </div>

          {/* Section: Statut Financier */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
              <CreditCard size={12} className="text-emerald-500" />
              Finances
            </h3>
            <div className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm ring-1 ring-black/[0.02]">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Statut de paiement</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-slate-900 dark:text-white">0</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">CFA Restant</span>
                </div>
              </div>
              <div className="text-right space-y-2">
                <StatusBadge status={student.paiement || "Complet"} variant="payment" className="h-7 px-4 text-[10px] border-0 shadow-sm" />
                <p className="text-[10px] text-emerald-500 font-bold underline cursor-pointer hover:text-emerald-600 transition-colors">Historique</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer avec Actions Rapides */}
        <SheetFooter className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 gap-2 sm:justify-between shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 h-10 border-red-100 hover:bg-red-50 hover:text-red-600 text-slate-400 border-dashed dark:border-slate-800 dark:hover:bg-red-900/20 transition-all font-bold text-xs"
          >
            <Trash2 size={14} className="mr-2" />
            Supprimer
          </Button>
          <Button 
            size="sm"
            onClick={() => onEdit?.(student)}
            className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-xl shadow-slate-200 dark:shadow-emerald-900/20 transition-all font-black text-xs uppercase tracking-wider"
          >
            <Pencil size={14} className="mr-2" />
            Modifier le Profil
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

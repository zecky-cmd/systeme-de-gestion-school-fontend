"use client";

import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Flag, User, GraduationCap, CreditCard } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface StudentDetailSheetProps {
  student: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailSheet({ student, open, onOpenChange }: StudentDetailSheetProps) {
  if (!student) return null;

  const nom = student.nom || student.user?.nom || "Non renseigné";
  const prenom = student.prenom || student.user?.prenom || "";
  const fullNom = `${nom} ${prenom}`;
  const photoUrl = student.photoUrl || student.user?.photoUrl;
  const initials = nom.substring(0, 1) + (prenom.substring(0, 1) || "");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-100 dark:border-emerald-900/30 overflow-hidden bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shadow-lg">
                {photoUrl ? (
                  <img src={photoUrl} alt={fullNom} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-emerald-600 uppercase">{initials}</span>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <StatusBadge status={student.statut || "Inscrit"} />
              </div>
            </div>
            
            <div className="space-y-1">
              <SheetTitle className="text-xl uppercase font-extrabold tracking-tight">{fullNom}</SheetTitle>
              <SheetDescription className="font-medium text-slate-500">
                Matricule: <span className="text-emerald-600 font-bold">{student.matricule || "N/A"}</span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Section: Informations Personnelles */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
              <User size={14} />
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Sexe</p>
                <p className="font-semibold">{student.sexe === "M" ? "Masculin" : "Féminin"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Nationalité</p>
                <div className="flex items-center gap-2 font-semibold">
                  <Flag size={14} className="text-slate-400" />
                  {student.nationalite || "Ivoirienne"}
                </div>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Naissance</p>
                <div className="flex items-center gap-2 font-semibold">
                  <Calendar size={14} className="text-slate-400" />
                  {student.dateNaissance ? new Date(student.dateNaissance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : "Date inconnue"}
                  <span className="text-slate-300 mx-1">|</span>
                  <MapPin size={14} className="text-slate-400" />
                  {student.lieuNaissance || "Lieu non renseigné"}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Scolarité & Classe */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
              <GraduationCap size={14} />
              Parcours Académique
            </h3>
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Classe Actuelle</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{student.classe?.nom || "Non affecté"}</p>
                </div>
                <Badge variant="outline" className="bg-white dark:bg-slate-950 border-emerald-200 text-emerald-700 dark:text-emerald-400">
                  Année 2025-2026
                </Badge>
              </div>
            </div>
          </div>

          {/* Section: Statut Financier */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
              <CreditCard size={14} />
              Scolarité & Paiements
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Statut des paiements</p>
                <p className="text-xs text-slate-500 italic">Reste à payer : 0 CFA</p>
              </div>
              <StatusBadge status={student.paiement || "Complet"} variant="payment" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

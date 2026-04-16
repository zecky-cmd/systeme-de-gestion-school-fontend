"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaiementService, Paiement } from "@/services/paiement.service";
import { ClasseService } from "@/services/classe.service";
import { PaymentStats } from "@/features/payments/components/PaymentStats";
import { PaymentTable } from "@/features/payments/components/PaymentTable";
import { AddPaymentSheet } from "@/features/payments/components/AddPaymentSheet";
import { RubriqueManager } from "@/features/payments/components/RubriqueManager";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, 
  History, 
  Settings2, 
  Filter, 
  Search,
  LayoutGrid,
  School,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export default function PaiementsPage() {
  const [activeTab, setActiveTab] = useState("history");
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Filtres
  const [search, setSearch] = useState("");
  const [classeFilter, setClasseFilter] = useState<string>("all");

  // Fetch Payments
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => PaiementService.getAll(),
  });

  // Fetch Classes for filtering
  const { data: classes = [] } = useQuery({
    queryKey: ["classes-all"],
    queryFn: () => ClasseService.getAll(),
  });

  // Filtrage
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchSearch = `${p.eleve?.nom} ${p.eleve?.prenom} ${p.eleve?.matricule}`.toLowerCase().includes(search.toLowerCase());
      const matchClass = classeFilter === "all" || p.eleve?.classe?.id.toString() === classeFilter;
      return matchSearch && matchClass;
    });
  }, [payments, search, classeFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const totalEncasse = payments.reduce((acc, curr) => acc + curr.montant, 0);
    // Note: These would ideally come from a real FinanceStats endpoint
    return {
      totalEncasse,
      totalCreances: 4500000, 
      tauxRecouvrement: 78,
      paiementsDuJour: payments.filter(p => new Date(p.datePaiement).toDateString() === new Date().toDateString()).length
    };
  }, [payments]);

  const handleShowReceipt = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto flex-1 overflow-y-auto scrollbar-none"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          title="Finances & Recouvrement" 
          subtitle="Suivi des encaissements et gestion des frais de scolarité."
        />
        <Button 
          onClick={() => setIsAddOpen(true)}
          className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest h-12 px-8 shadow-xl shadow-emerald-500/20 group transition-all"
        >
          <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
          Nouveau Versement
        </Button>
      </div>

      <PaymentStats stats={stats} isLoading={isLoading} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <TabsList className="bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800 h-14 w-full lg:w-auto">
            <TabsTrigger value="history" className="rounded-[1.5rem] px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-emerald-600 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-[0.1em] gap-2">
              <History size={16} /> Historique
            </TabsTrigger>
            <TabsTrigger value="rubriques" className="rounded-[1.5rem] px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-blue-600 data-[state=active]:text-blue-700 dark:data-[state=active]:text-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-[0.1em] gap-2">
              <Settings2 size={16} /> Rubriques
            </TabsTrigger>
          </TabsList>

          {activeTab === "history" && (
            <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <div className="relative flex-1 lg:w-64 min-w-[200px]">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher un versement..." 
                  className="pl-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <Select value={classeFilter} onValueChange={(val) => val && setClasseFilter(val)}>
                <SelectTrigger className="h-11 w-48 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-emerald-500" />
                    <SelectValue placeholder="Toutes les classes" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800">
                  <SelectItem value="all" className="text-xs font-bold uppercase tracking-widest">Toutes les classes</SelectItem>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()} className="text-xs font-bold uppercase tracking-widest">{c.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <TabsContent value="history" className="mt-0 focus-visible:outline-none">
            <motion.div
               key={activeTab + classeFilter + search}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.98 }}
               transition={{ duration: 0.2 }}
            >
               <PaymentTable 
                 payments={filteredPayments} 
                 isLoading={isLoading} 
                 onShowReceipt={handleShowReceipt}
               />
            </motion.div>
          </TabsContent>

          <TabsContent value="rubriques" className="mt-0 focus-visible:outline-none">
            <RubriqueManager />
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      <AddPaymentSheet 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
      />
    </motion.div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaiementService, Paiement } from "@/services/paiement.service";
import { PaymentTable } from "@/features/payments/components/PaymentTable";
import { AddPaymentModal } from "@/features/payments/components/AddPaymentModal";
import { RubriqueManager } from "@/features/payments/components/RubriqueManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  History, 
  Settings2, 
  Search,
  Download
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
  const [modeFilter, setModeFilter] = useState<string>("all");

  // Fetch Payments
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => PaiementService.getAll(),
  });

  // Filtrage
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchSearch = `${p.eleve?.nom} ${p.eleve?.prenom} ${p.eleve?.matricule}`.toLowerCase().includes(search.toLowerCase());
      const matchMode = modeFilter === "all" || p.mode === modeFilter;
      return matchSearch && matchMode;
    });
  }, [payments, search, modeFilter]);

  const handleShowReceipt = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto flex-1 overflow-y-auto scrollbar-none"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <TabsList className="bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800 h-14 w-full lg:w-auto">
            <TabsTrigger value="history" className="rounded-[1.5rem] px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-emerald-600 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-[0.1em] gap-2">
              <History size={16} /> Paiements
            </TabsTrigger>
            <TabsTrigger value="rubriques" className="rounded-[1.5rem] px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-blue-600 data-[state=active]:text-blue-700 dark:data-[state=active]:text-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-[0.1em] gap-2">
              <Settings2 size={16} /> Configuration
            </TabsTrigger>
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          <TabsContent value="history" className="mt-0 focus-visible:outline-none space-y-6">
            
            {/* Toolbar (Search, Filter, Buttons) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Rechercher un paiement..." 
                    className="pl-11 h-11 rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <Select value={modeFilter} onValueChange={(val) => val && setModeFilter(val)}>
                  <SelectTrigger className="h-11 w-48 rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700">
                    <SelectValue placeholder="Tous les modes" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-slate-200 dark:border-slate-800">
                    <SelectItem value="all" className="text-sm">Tous les modes</SelectItem>
                    <SelectItem value="esp" className="text-sm">Especes</SelectItem>
                    <SelectItem value="mobile" className="text-sm">Mobile Money</SelectItem>
                    <SelectItem value="virement" className="text-sm">Virement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button variant="outline" className="h-11 px-6 rounded-lg font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 gap-2">
                  <Download size={16} /> Rapport
                </Button>
                <Button 
                  onClick={() => setIsAddOpen(true)}
                  className="h-11 px-6 rounded-lg font-semibold bg-emerald-700 hover:bg-emerald-800 text-white gap-2"
                >
                  <span className="text-lg leading-none">+</span> Nouvel encaissement
                </Button>
              </div>
            </div>

            {/* Table Area */}
            <motion.div
               key={activeTab + modeFilter + search}
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

      <AddPaymentModal 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
      />
    </motion.div>
  );
}

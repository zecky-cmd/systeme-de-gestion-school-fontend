import React, { useState, useEffect } from "react";
import { X, Copy } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CategorieTarifaire, RubriqueFinanciere } from "@/services/finance.service";

interface NewRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategorieTarifaire[];
  anneeId: number;
  initialRubric?: RubriqueFinanciere | null;
  onSave: (data: {
    libelle: string;
    estObligatoire: boolean;
    tarifs: { niveau: string; categorieId: number; montant: number }[];
  }) => Promise<void>;
}

const LEVELS = ["6e", "5e", "4e", "3e", "2nde", "1ere", "Tle"];

export function NewRubricModal({
  isOpen,
  onClose,
  categories,
  anneeId,
  initialRubric = null,
  onSave
}: NewRubricModalProps) {
  const [libelle, setLibelle] = useState<string>("");
  const [estObligatoire, setEstObligatoire] = useState<boolean>(true);
  
  // prices state structure: Record<categorieId, Record<level, { montant: number; id?: number }>>
  const [prices, setPrices] = useState<Record<number, Record<string, { montant: number; id?: number }>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Initialize form state
  useEffect(() => {
    if (isOpen) {
      setError("");
      if (initialRubric) {
        setLibelle(initialRubric.libelle);
        setEstObligatoire(initialRubric.estObligatoire);
        
        // Populate existing prices
        const initialPrices: Record<number, Record<string, { montant: number; id?: number }>> = {};
        
        // Pre-fill categories and levels with 0 first
        categories.forEach(cat => {
          initialPrices[cat.id] = {};
          LEVELS.forEach(lvl => {
            initialPrices[cat.id][lvl] = { montant: 0 };
          });
        });
        
        // Fill in actual prices from rubric
        initialRubric.tarifs.forEach(tarif => {
          if (initialPrices[tarif.categorieId]) {
            initialPrices[tarif.categorieId][tarif.niveau] = { 
              montant: Number(tarif.montant), 
              id: tarif.id 
            };
          }
        });
        
        setPrices(initialPrices);
      } else {
        setLibelle("");
        setEstObligatoire(true);
        
        const initialPrices: Record<number, Record<string, { montant: number; id?: number }>> = {};
        categories.forEach(cat => {
          initialPrices[cat.id] = {};
          LEVELS.forEach(lvl => {
            initialPrices[cat.id][lvl] = { montant: 0 };
          });
        });
        setPrices(initialPrices);
      }
    }
  }, [isOpen, initialRubric, categories]);

  const handlePriceChange = (catId: number, level: string, value: string) => {
    const numericValue = value === "" ? 0 : Math.max(0, parseInt(value, 10) || 0);
    setPrices(prev => ({
      ...prev,
      [catId]: {
        ...prev[catId],
        [level]: { ...prev[catId]?.[level], montant: numericValue }
      }
    }));
  };

  // Copy prices from the first category to all other categories
  const handleCopyToAll = (sourceCatId: number) => {
    const sourcePrices = prices[sourceCatId];
    if (!sourcePrices) return;

    setPrices(prev => {
      const nextPrices = { ...prev };
      categories.forEach(cat => {
        if (cat.id !== sourceCatId) {
          const newCatPrices: Record<string, { montant: number; id?: number }> = {};
          LEVELS.forEach(lvl => {
            newCatPrices[lvl] = {
              montant: sourcePrices[lvl]?.montant || 0,
              id: prev[cat.id]?.[lvl]?.id // preserve ID
            };
          });
          nextPrices[cat.id] = newCatPrices;
        }
      });
      return nextPrices;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!libelle.trim()) {
      setError("Le nom de la rubrique est requis");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Flatten prices to the API format
      const tariffsPayload: { niveau: string; categorieId: number; montant: number; id?: number }[] = [];
      
      Object.entries(prices).forEach(([catIdStr, levelPrices]) => {
        const catId = parseInt(catIdStr, 10);
        Object.entries(levelPrices).forEach(([level, data]) => {
          if (data.montant >= 0) { // Send all valid prices, backend will handle zero or non-zero
            tariffsPayload.push({
              niveau: level,
              categorieId: catId,
              montant: data.montant
            });
          }
        });
      });

      await onSave({
        libelle: libelle.trim(),
        estObligatoire,
        tarifs: tariffsPayload as any
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      
      // Extract backend error message if available
      let errorMessage = "Une erreur est survenue lors de l'enregistrement.";
      if (err?.response?.data?.message) {
        const backendMsg = err.response.data.message;
        errorMessage = Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white border-none shadow-2xl rounded-2xl overflow-hidden p-0 flex flex-col max-h-[85vh]">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 shrink-0">
          <DialogTitle className="text-lg font-bold text-slate-900 font-heading">
            {initialRubric ? "Modifier la rubrique" : "Nouvelle rubrique"}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-medium text-rose-600">
                {error}
              </div>
            )}

            {/* Rubric General Info */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-1.5 flex-1 w-full">
                <Label htmlFor="libelle" className="text-xs font-semibold text-slate-700">
                  Nom de la rubrique
                </Label>
                <Input
                  id="libelle"
                  value={libelle}
                  onChange={(e) => setLibelle(e.target.value)}
                  placeholder="Ex: Inscription, Scolarité T1..."
                  className="w-full text-slate-800 placeholder-slate-400 border-slate-200 focus-visible:ring-primary rounded-xl"
                  required
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3 sm:mt-5">
                <Label htmlFor="estObligatoire" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Rubrique obligatoire
                </Label>
                <Switch
                  id="estObligatoire"
                  checked={estObligatoire}
                  onCheckedChange={setEstObligatoire}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            {/* Dynamic Price Grid per Category */}
            <div className="space-y-6 pt-2">
              {categories.map((cat, idx) => (
                <div key={cat.id} className="space-y-3 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Tarifs - {cat.nom}
                    </h4>
          
                  </div>

                  {/* Level inputs grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {LEVELS.map(lvl => (
                      <div key={lvl} className="flex flex-col gap-1 items-center bg-white border border-slate-100 rounded-xl p-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {lvl}
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={prices[cat.id]?.[lvl]?.montant ?? 0}
                          onChange={(e) => handlePriceChange(cat.id, lvl, e.target.value)}
                          className="w-full min-w-[60px] h-8 px-1 text-center text-sm text-slate-800 bg-transparent border-none font-semibold focus:outline-none focus:ring-1 focus:ring-primary rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3 shrink-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              disabled={isSubmitting}
              className="hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 rounded-xl border-none shadow-lg shadow-primary/20"
            >
              {isSubmitting ? "Enregistrement..." : (initialRubric ? "Enregistrer" : "Ajouter")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

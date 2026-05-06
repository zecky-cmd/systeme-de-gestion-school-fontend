import { useState } from "react";
import { AcademicYear, EvaluationPeriod } from "@/services/academic-year.service";

export function useAcademicYearView() {
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<Partial<AcademicYear> | null>(null);
  const [isPeriodDialogOpen, setIsPeriodDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Partial<EvaluationPeriod> | null>(null);

  const handlers = {
    openCreateYear: () => {
      setSelectedYear({ modeEval: "trim" });
      setIsYearDialogOpen(true);
    },
    openEditYear: (year: AcademicYear) => {
      setSelectedYear(year);
      setIsYearDialogOpen(true);
    },
    closeYearDialog: () => {
      setSelectedYear(null);
      setIsYearDialogOpen(false);
    },
    openEditPeriod: (period: EvaluationPeriod) => {
      setSelectedPeriod(period);
      setIsPeriodDialogOpen(true);
    },
    closePeriodDialog: () => {
      setSelectedPeriod(null);
      setIsPeriodDialogOpen(false);
    },
    updateSelectedYear: (data: Partial<AcademicYear>) => {
      setSelectedYear(prev => ({ ...prev, ...data }));
    },
    updateSelectedPeriod: (data: Partial<EvaluationPeriod>) => {
      setSelectedPeriod(prev => ({ ...prev, ...data }));
    }
  };

  return {
    isYearDialogOpen,
    setIsYearDialogOpen,
    selectedYear,
    isPeriodDialogOpen,
    setIsPeriodDialogOpen,
    selectedPeriod,
    handlers
  };
}

import React from "react";
import { AcademicYear, EvaluationPeriod } from "@/services/academic-year.service";

// Hooks et Composants extraits
import { useAcademicYearView } from "./academic-year/useAcademicYearView";
import { YearCard } from "./academic-year/YearCard";
import { PeriodsCard } from "./academic-year/PeriodsCard";

// Modals
import { YearDialog } from "./academic-year/modals/YearDialog";
import { PeriodDialog } from "./academic-year/modals/PeriodDialog";

interface AcademicYearViewProps {
  years: AcademicYear[];
  periods: EvaluationPeriod[];
  activeYearId?: number;
  onSetActiveYear: (id: number) => void;
  onCreateYear: (data: Partial<AcademicYear>) => void;
  onUpdateYear: (id: number, data: Partial<AcademicYear>) => void;
  onCreatePeriod: (data: Partial<EvaluationPeriod>) => void;
  onUpdatePeriod: (id: number, data: Partial<EvaluationPeriod>) => void;
  isSettingActive?: boolean;
}

export function AcademicYearView({ 
  years, 
  periods, 
  activeYearId,
  onSetActiveYear,
  onCreateYear,
  onUpdateYear,
  onUpdatePeriod,
  isSettingActive 
}: AcademicYearViewProps) {
  const {
    isYearDialogOpen,
    setIsYearDialogOpen,
    selectedYear,
    isPeriodDialogOpen,
    setIsPeriodDialogOpen,
    selectedPeriod,
    handlers
  } = useAcademicYearView();

  const handleYearSave = () => {
    if (selectedYear?.id) {
      onUpdateYear(selectedYear.id, selectedYear);
    } else {
      onCreateYear(selectedYear || {});
    }
    handlers.closeYearDialog();
  };

  const handlePeriodSave = () => {
    if (selectedPeriod?.id) {
      onUpdatePeriod(selectedPeriod.id, selectedPeriod);
    }
    handlers.closePeriodDialog();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Liste des Années scolaires */}
      <YearCard 
        years={years}
        activeYearId={activeYearId}
        onSetActiveYear={onSetActiveYear}
        onAddClick={handlers.openCreateYear}
        onEditClick={handlers.openEditYear}
        isSettingActive={isSettingActive}
      />
      
      {/* 2. Liste des Périodes d'évaluation */}
      <PeriodsCard 
        periods={periods}
        onEditClick={handlers.openEditPeriod}
        modeEval={years.find(y => y.id === activeYearId)?.modeEval}
      />

      {/* 3. Modals */}
      <YearDialog 
        open={isYearDialogOpen}
        onOpenChange={setIsYearDialogOpen}
        selectedYear={selectedYear}
        onUpdateSelectedYear={handlers.updateSelectedYear}
        onSave={handleYearSave}
      />

      <PeriodDialog 
        open={isPeriodDialogOpen}
        onOpenChange={setIsPeriodDialogOpen}
        selectedPeriod={selectedPeriod}
        onUpdateSelectedPeriod={handlers.updateSelectedPeriod}
        onSave={handlePeriodSave}
      />
    </div>
  );
}

"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useConfigPage } from "./hooks/useConfigPage";
import { useSchoolConfig } from "./hooks/useSchoolConfig";
import { useAcademicYear } from "./hooks/useAcademicYear";
import { usePedagogy } from "./hooks/usePedagogy";
import { ConfigTopBar } from "./components/ConfigTopBar";
import { EtablissementView } from "./components/EtablissementView";
import { AcademicYearView } from "./components/AcademicYearView";
import { PedagogyView } from "./components/PedagogyView";

export function ConfigPage() {
  const { activeTab, setActiveTab } = useConfigPage();
  
  const { 
    formData: schoolData, 
    handleInputChange: handleSchoolChange, 
    handleSave: saveSchool,
    handleLogoUpload,
    isSaving: isSavingSchool 
  } = useSchoolConfig();

  const {
    years,
    periods,
    setActiveYear,
    createYear,
    updateYear,
    createPeriod,
    updatePeriod,
    isSettingActive
  } = useAcademicYear();
  
  const {
    subjects,
    levels,
    noteTypes,
    updateCoefficients,
    updateNoteTypes,
    createSubject,
    updateSubject,
    deleteSubject,
    createLevel,
    deleteLevel,
    isLoading: isLoadingPedagogy,
    isSaving: isSavingPedagogy
  } = usePedagogy();

  // Force activeTab to a valid one if it's currently invalid
  React.useEffect(() => {
    const validTabs = ["etablissement", "annee", "pedagogie", "frais", "utilisateurs", "securite"];
    if (!validTabs.includes(activeTab)) {
      setActiveTab("etablissement");
    }
  }, [activeTab, setActiveTab]);

  return (
    <div className="flex-1 flex flex-col bg-[oklch(0.98_0.002_240)] min-h-screen">
      <ConfigTopBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === "etablissement" && (
            <motion.div 
              key="etablissement" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
            >
              <EtablissementView 
                data={schoolData} 
                onChange={handleSchoolChange}
                onSave={saveSchool}
                onLogoChange={handleLogoUpload}
                isSaving={isSavingSchool}
              />
            </motion.div>
          )}
          {activeTab === "annee" && (
            <motion.div 
              key="annee" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
            >
              <AcademicYearView 
                years={years} 
                periods={periods}
                activeYearId={schoolData.anneeActiveId}
                onSetActiveYear={setActiveYear}
                onCreateYear={createYear}
                onUpdateYear={updateYear}
                onCreatePeriod={createPeriod}
                onUpdatePeriod={updatePeriod}
                isSettingActive={isSettingActive}
              />
            </motion.div>
          )}
          {activeTab === "pedagogie" && (
            <motion.div 
              key="pedagogie" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
            >
              <PedagogyView 
                subjects={subjects}
                levels={levels}
                noteTypes={noteTypes}
                onUpdateCoefficients={updateCoefficients}
                onUpdateNoteTypes={updateNoteTypes}
                onCreateSubject={createSubject}
                onUpdateSubject={updateSubject}
                onDeleteSubject={deleteSubject}
                onCreateLevel={createLevel}
                onDeleteLevel={deleteLevel}
                isSaving={isSavingPedagogy}
              />
        </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

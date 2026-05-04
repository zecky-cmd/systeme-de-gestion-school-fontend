"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useConfigPage } from "./hooks/useConfigPage";
import { useSchoolConfig } from "./hooks/useSchoolConfig";
import { useAcademicYear } from "./hooks/useAcademicYear";
import { ConfigTopBar } from "./components/ConfigTopBar";
import { EtablissementView } from "./components/EtablissementView";
import { AcademicYearView } from "./components/AcademicYearView";

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
    series,
    updateSeries,
    isSavingSeries
  } = useAcademicYear();

  // Force activeTab to only be etablissement or annee if it was something else
  React.useEffect(() => {
    if (activeTab !== "etablissement" && activeTab !== "annee") {
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
                series={series}
                onUpdateSeries={updateSeries}
                isSavingSeries={isSavingSeries}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

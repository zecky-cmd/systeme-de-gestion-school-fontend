"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";

// Hooks
import { useEmploisPage } from "./hooks/useEmploisPage";
import { useSchedule } from "./hooks/useSchedule";
import { useAffectations } from "./hooks/useAffectations";

// Components
import { EmploisTopBar } from "./components/EmploisTopBar";
import { PlanningView } from "./components/PlanningView";
import { AffectationsView } from "./components/AffectationsView";
import { AddCourseModal } from "./components/AddCourseModal";
import { AddAffectationModal } from "./components/AddAffectationModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";

export function EmploisPage() {
  const { 
    activeTab, setActiveTab, 
    selectedClasseId, setSelectedClasseId, 
    classes 
  } = useEmploisPage();

  const { 
    slots, isSlotsLoading, 
    isModalOpen, setIsModalOpen, 
    formData, setFormData, 
    openAddModal, handleAddCourse, deleteSlot, isPending: isSlotPending 
  } = useSchedule(selectedClasseId);

  const { 
    affectations, isAffLoading, 
    isAffModalOpen, setIsAffModalOpen, 
    deleteConfirmId, setDeleteConfirmId, 
    affData, setAffData, 
    filteredEnseignantsForAff, allMatieres, 
    availableMatieresInModal, availableAffectationsForMatiere, 
    openAffModal, createAff, deleteAff, isPending: isAffPending, isDeleting 
  } = useAffectations(selectedClasseId);

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      <EmploisTopBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        selectedClasseId={selectedClasseId} 
        setSelectedClasseId={setSelectedClasseId} 
        classes={classes} 
      />

      <AnimatePresence mode="wait">
        {activeTab === "planning" ? (
          <PlanningView 
            slots={slots} 
            onAddCourse={openAddModal} 
            onDeleteCourse={deleteSlot} 
          />
        ) : (
          <AffectationsView 
            affectations={affectations} 
            isLoading={isAffLoading} 
            onOpenAddModal={openAffModal} 
            onDeleteRequest={setDeleteConfirmId} 
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AddCourseModal 
        isOpen={isModalOpen} 
        onClose={setIsModalOpen} 
        formData={formData} 
        setFormData={setFormData} 
        availableMatieres={availableMatieresInModal} 
        availableAffectations={availableAffectationsForMatiere(formData.matiereId)} 
        isPending={isSlotPending} 
        onConfirm={handleAddCourse} 
      />

      <AddAffectationModal 
        isOpen={isAffModalOpen} 
        onClose={setIsAffModalOpen} 
        affData={affData} 
        setAffData={setAffData} 
        allMatieres={allMatieres} 
        filteredEnseignants={filteredEnseignantsForAff} 
        isPending={isAffPending} 
        onConfirm={() => createAff({ 
          classeId: parseInt(affData.classeId), 
          matiereId: parseInt(affData.matiereId), 
          enseignantId: parseInt(affData.enseignantId), 
          coefficient: parseInt(affData.coefficient), 
          noteMax: 20 
        })} 
      />

      <DeleteConfirmModal 
        isOpen={deleteConfirmId !== null} 
        onClose={() => setDeleteConfirmId(null)} 
        onConfirm={() => deleteConfirmId && deleteAff(deleteConfirmId)} 
        isPending={isDeleting} 
      />
    </div>
  );
}

import { SubjectCoefficient } from "@/services/pedagogy.service";
import { Matiere } from "@/services/matiere.service";

// Hooks et Composants extraits
import { usePedagogyView } from "./pedagogy/usePedagogyView";
import { LevelsCard } from "./pedagogy/LevelsCard";
import { SubjectsTable } from "./pedagogy/SubjectsTable";

// Modals
import { AddSubjectModal } from "./pedagogy/modals/AddSubjectModal";
import { AddLevelModal } from "./pedagogy/modals/AddLevelModal";
import { CoefModal } from "./pedagogy/modals/CoefModal";
import { DeleteModal } from "./pedagogy/modals/DeleteModal";

interface PedagogyViewProps {
  subjects: SubjectCoefficient[];
  levels: string[];
  onUpdateCoefficients: (subjects: SubjectCoefficient[]) => void;
  onCreateSubject: (data: any) => void;
  onUpdateSubject: (id: number, data: Partial<Matiere>) => void;
  onDeleteSubject: (id: number) => void;
  onCreateLevel: (data: { nom: string, cycle: "col" | "lyc" }) => void;
  onDeleteLevel: (level: string) => void;
  isSaving: boolean;
}

export function PedagogyView(props: PedagogyViewProps) {
  const {
    localSubjects,
    modals,
    selectedSubject,
    formData,
    levelData,
    handlers,
    handleCoefChange
  } = usePedagogyView({
    initialSubjects: props.subjects,
    levels: props.levels,
    onCreateSubject: props.onCreateSubject,
    onUpdateCoefficients: props.onUpdateCoefficients,
    onCreateLevel: props.onCreateLevel,
    onDeleteSubject: props.onDeleteSubject
  });

  return (
    <div className="space-y-6">
      {/* 1. Carte des Niveaux */}
      <LevelsCard 
        levels={props.levels}
        onAddClick={handlers.openLevel}
        onDeleteLevel={props.onDeleteLevel}
      />

      {/* 2. Tableau des Matières */}
      <SubjectsTable 
        subjects={localSubjects}
        levels={props.levels}
        onAddClick={handlers.openAdd}
        onSaveAll={handlers.submitCoefSave}
        onEditCoef={handlers.openCoef}
        onDeleteSubject={handlers.openDelete}
        isSaving={props.isSaving}
      />

      {/* 3. Modals */}
      <AddSubjectModal 
        isOpen={modals.add}
        onClose={handlers.closeAdd}
        onSubmit={handlers.submitAdd}
        formData={formData}
        setFormData={handlers.updateFormData}
        levels={props.levels}
      />

      <AddLevelModal 
        isOpen={modals.level}
        onClose={handlers.closeLevel}
        onSubmit={handlers.submitLevel}
        levelData={levelData}
        setLevelData={handlers.updateLevelData}
      />

      <CoefModal 
        isOpen={modals.coef}
        onClose={handlers.closeCoef}
        onSave={handlers.submitCoefSave}
        selectedSubject={selectedSubject}
        levels={props.levels}
        onCoefChange={handleCoefChange}
      />

      <DeleteModal 
        isOpen={modals.delete}
        onClose={handlers.closeDelete}
        onConfirm={handlers.confirmDelete}
      />
    </div>
  );
}

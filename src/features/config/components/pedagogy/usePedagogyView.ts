import { useState, useEffect } from "react";
import { SubjectCoefficient } from "@/services/pedagogy.service";
import { Matiere } from "@/services/matiere.service";
import { DEFAULT_COEFFICIENT } from "./constants";

interface UsePedagogyViewProps {
  initialSubjects: SubjectCoefficient[];
  levels: string[];
  onCreateSubject: (data: any) => void;
  onUpdateCoefficients: (subjects: SubjectCoefficient[]) => void;
  onCreateLevel: (data: { nom: string, cycle: "col" | "lyc" }) => void;
  onDeleteSubject: (id: number) => void;
}

export function usePedagogyView({
  initialSubjects,
  levels,
  onCreateSubject,
  onUpdateCoefficients,
  onCreateLevel,
  onDeleteSubject
}: UsePedagogyViewProps) {
  const [localSubjects, setLocalSubjects] = useState<SubjectCoefficient[]>(initialSubjects || []);
  
  // States des Modals
  const [modals, setModals] = useState({
    add: false,
    level: false,
    coef: false,
    delete: false
  });

  const [selectedSubject, setSelectedSubject] = useState<SubjectCoefficient | null>(null);
  
  const [formData, setFormData] = useState({
    nom: "",
    code: "",
    cycle: "tous" as "col" | "lyc" | "tous",
    groupe: "",
    coefficients: {} as Record<string, number>
  });

  const [levelData, setLevelData] = useState({
    nom: "",
    cycle: "col" as "col" | "lyc"
  });

  useEffect(() => {
    if (initialSubjects) setLocalSubjects(initialSubjects);
  }, [initialSubjects]);

  // Initialiser les coefficients par défaut lors de l'ouverture du modal d'ajout
  useEffect(() => {
    if (modals.add && levels) {
      const defaultCoefs: Record<string, number> = {};
      levels.forEach(l => defaultCoefs[l] = DEFAULT_COEFFICIENT);
      setFormData(prev => ({ ...prev, coefficients: defaultCoefs }));
    }
  }, [modals.add, levels]);

  const handleCoefChange = (subjectId: number, level: string, value: number) => {
    setLocalSubjects(prev => prev?.map(s => {
      if (s.id === subjectId) {
        const updated = { ...s, coefficients: { ...s.coefficients, [level]: value } };
        if (selectedSubject?.id === subjectId) {
          setSelectedSubject(updated);
        }
        return updated;
      }
      return s;
    }) || []);
  };

  const handlers = {
    openAdd: () => setModals(m => ({ ...m, add: true })),
    closeAdd: () => setModals(m => ({ ...m, add: false })),
    
    openLevel: () => setModals(m => ({ ...m, level: true })),
    closeLevel: () => setModals(m => ({ ...m, level: false })),
    
    openCoef: (subject: SubjectCoefficient) => {
      setSelectedSubject(subject);
      setModals(m => ({ ...m, coef: true }));
    },
    closeCoef: () => {
      setSelectedSubject(null);
      setModals(m => ({ ...m, coef: false }));
    },
    
    openDelete: (subject: SubjectCoefficient) => {
      setSelectedSubject(subject);
      setModals(m => ({ ...m, delete: true }));
    },
    closeDelete: () => {
      setSelectedSubject(null);
      setModals(m => ({ ...m, delete: false }));
    },

    submitAdd: (e: React.FormEvent) => {
      e.preventDefault();
      onCreateSubject(formData);
      setModals(m => ({ ...m, add: false }));
    },

    submitLevel: (e: React.FormEvent) => {
      e.preventDefault();
      onCreateLevel(levelData);
      setModals(m => ({ ...m, level: false }));
      setLevelData({ nom: "", cycle: "col" });
    },

    submitCoefSave: () => {
      onUpdateCoefficients(localSubjects);
      setModals(m => ({ ...m, coef: false }));
      setSelectedSubject(null);
    },

    confirmDelete: () => {
      if (selectedSubject) {
        onDeleteSubject(selectedSubject.id);
        setModals(m => ({ ...m, delete: false }));
        setSelectedSubject(null);
      }
    },

    updateFormData: (data: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...data })),
    updateLevelData: (data: Partial<typeof levelData>) => setLevelData(prev => ({ ...prev, ...data }))
  };

  return {
    localSubjects,
    modals,
    selectedSubject,
    formData,
    levelData,
    handlers,
    handleCoefChange
  };
}

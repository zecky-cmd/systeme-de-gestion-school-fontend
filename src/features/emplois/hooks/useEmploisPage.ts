import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClasseService } from "@/services/classe.service";

export function useEmploisPage() {
  const [activeTab, setActiveTab] = useState<"planning" | "affectations">("planning");
  const [selectedClasseId, setSelectedClasseId] = useState<string>("");

  // Fetch Classes
  const { data: classes = [], isLoading: isClassesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: () => ClasseService.getAll(),
  });

  // Initialisation de la classe par défaut
  useEffect(() => {
    if (classes && classes.length > 0 && !selectedClasseId) {
      setSelectedClasseId(classes[0].id.toString());
    }
  }, [classes, selectedClasseId]);

  return {
    activeTab,
    setActiveTab,
    selectedClasseId,
    setSelectedClasseId,
    classes,
    isClassesLoading
  };
}

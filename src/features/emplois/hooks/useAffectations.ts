import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AffectationService } from "@/services/affectation.service";
import { MatiereService } from "@/services/matiere.service";
import { EnseignantService } from "@/services/enseignant.service";
import { toast } from "sonner";

export function useAffectations(selectedClasseId: string) {
  const queryClient = useQueryClient();
  const [isAffModalOpen, setIsAffModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [affData, setAffData] = useState({
    classeId: "",
    matiereId: "",
    enseignantId: "",
    coefficient: "2"
  });

  // 1. Fetch Data
  const { data: affectations = [], isLoading: isAffLoading } = useQuery({
    queryKey: ["affectations", selectedClasseId],
    queryFn: () => AffectationService.getAll(parseInt(selectedClasseId)),
    enabled: !!selectedClasseId
  });

  const { data: allMatieres = [] } = useQuery({ 
    queryKey: ["matieres"], 
    queryFn: () => MatiereService.getAll() 
  });
  
  const { data: allEnseignants = [] } = useQuery({ 
    queryKey: ["enseignants"], 
    queryFn: () => EnseignantService.getAll() 
  });

  // 2. Logic & Filtering
  const filteredEnseignantsForAff = useMemo(() => {
    if (!affData.matiereId) return [];
    const selectedMatiere = allMatieres.find(m => m.id.toString() === affData.matiereId);
    if (!selectedMatiere) return [];
    
    return allEnseignants.filter(e => 
      e.specialites && e.specialites.some(s => s.toLowerCase() === selectedMatiere.nom.toLowerCase())
    );
  }, [affData.matiereId, allMatieres, allEnseignants]);

  const availableMatieresInModal = useMemo(() => {
    const uniqueIds = Array.from(new Set(affectations.map(a => a.matiereId)));
    return allMatieres.filter(m => uniqueIds.includes(m.id));
  }, [affectations, allMatieres]);

  const availableAffectationsForMatiere = (matiereId: string) => {
    if (!matiereId) return [];
    return affectations.filter(a => a.matiereId.toString() === matiereId);
  };

  // 3. Mutations
  const createAffMutation = useMutation({
    mutationFn: (data: any) => AffectationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affectations"] });
      setIsAffModalOpen(false);
      setAffData({ ...affData, matiereId: "", enseignantId: "", coefficient: "2" });
      toast.success("Enseignant affecté !");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Erreur d'affectation")
  });

  const deleteAffMutation = useMutation({
    mutationFn: AffectationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affectations"] });
      setDeleteConfirmId(null);
      toast.success("Affectation supprimée !");
    },
    onError: (error: any) => toast.error("Erreur lors de la suppression")
  });

  const openAffModal = () => {
    setAffData({
      classeId: selectedClasseId,
      matiereId: "",
      enseignantId: "",
      coefficient: "2"
    });
    setIsAffModalOpen(true);
  };

  return {
    affectations,
    isAffLoading,
    isAffModalOpen,
    setIsAffModalOpen,
    deleteConfirmId,
    setDeleteConfirmId,
    affData,
    setAffData,
    filteredEnseignantsForAff,
    allMatieres,
    availableMatieresInModal,
    availableAffectationsForMatiere,
    openAffModal,
    createAff: createAffMutation.mutate,
    deleteAff: deleteAffMutation.mutate,
    isPending: createAffMutation.isPending,
    isDeleting: deleteAffMutation.isPending
  };
}

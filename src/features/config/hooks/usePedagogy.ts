import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PedagogyService, SubjectCoefficient, NoteType } from "@/services/pedagogy.service";
import { toast } from "sonner";

export function usePedagogy() {
  const queryClient = useQueryClient();

  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["pedagogy-subjects"],
    queryFn: PedagogyService.getSubjects
  });

  const { data: noteTypes = [], isLoading: isLoadingNotes } = useQuery({
    queryKey: ["pedagogy-note-types"],
    queryFn: PedagogyService.getNoteTypes
  });

  const updateCoefficientsMutation = useMutation({
    mutationFn: (allSubjects: SubjectCoefficient[]) => 
      PedagogyService.updateAllCoefficients(allSubjects),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-subjects"] });
      toast.success("Coefficients mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des coefficients");
    }
  });

  const updateNoteTypesMutation = useMutation({
    mutationFn: (allNoteTypes: NoteType[]) => 
      PedagogyService.updateAllNoteTypes(allNoteTypes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-note-types"] });
      toast.success("Poids des notes mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des poids");
    }
  });

  return {
    subjects,
    noteTypes,
    isLoading: isLoadingSubjects || isLoadingNotes,
    updateCoefficients: (allSubjects: SubjectCoefficient[]) => updateCoefficientsMutation.mutate(allSubjects),
    updateNoteTypes: (allNoteTypes: NoteType[]) => updateNoteTypesMutation.mutate(allNoteTypes),
    isSaving: updateCoefficientsMutation.isPending || updateNoteTypesMutation.isPending
  };
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PedagogyService } from "@/services/pedagogy.service";
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

  const updateCoefMutation = useMutation({
    mutationFn: ({ id, level, value }: { id: number; level: string; value: number }) => 
      PedagogyService.updateCoefficient(id, level, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-subjects"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du coefficient");
    }
  });

  return {
    subjects,
    noteTypes,
    isLoading: isLoadingSubjects || isLoadingNotes,
    updateCoefficient: (id: number, level: string, value: number) => 
      updateCoefMutation.mutate({ id, level, value })
  };
}

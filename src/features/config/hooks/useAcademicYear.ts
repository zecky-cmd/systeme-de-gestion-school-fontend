import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AcademicYearService } from "@/services/academic-year.service";
import { toast } from "sonner";

export function useAcademicYear() {
  const queryClient = useQueryClient();

  const { data: years = [], isLoading: isLoadingYears } = useQuery({
    queryKey: ["academic-years"],
    queryFn: AcademicYearService.getYears
  });

  const activeYear = years.find(y => y.isActive);

  const { data: periods = [], isLoading: isLoadingPeriods } = useQuery({
    queryKey: ["evaluation-periods", activeYear?.id],
    queryFn: () => activeYear ? AcademicYearService.getPeriods(activeYear.id) : Promise.resolve([]),
    enabled: !!activeYear
  });

  const { data: series = [], isLoading: isLoadingSeries } = useQuery({
    queryKey: ["school-series"],
    queryFn: AcademicYearService.getSeries
  });

  const updateSeriesMutation = useMutation({
    mutationFn: (allSeries: SchoolSeries[]) => 
      AcademicYearService.updateAllSeries(allSeries),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-series"] });
      toast.success("Séries mises à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des séries");
    }
  });

  return {
    years,
    activeYear,
    periods,
    series,
    isLoading: isLoadingYears || isLoadingPeriods || isLoadingSeries,
    updateSeries: (allSeries: SchoolSeries[]) => updateSeriesMutation.mutate(allSeries),
    isSavingSeries: updateSeriesMutation.isPending
  };
}

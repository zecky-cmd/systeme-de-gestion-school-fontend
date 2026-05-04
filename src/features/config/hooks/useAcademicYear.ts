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

  const toggleSeriesMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      AcademicYearService.toggleSeries(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-series"] });
    },
    onError: () => {
      toast.error("Erreur lors de la modification de la série");
    }
  });

  return {
    years,
    activeYear,
    periods,
    series,
    isLoading: isLoadingYears || isLoadingPeriods || isLoadingSeries,
    toggleSeries: (id: string, isActive: boolean) => toggleSeriesMutation.mutate({ id, isActive })
  };
}

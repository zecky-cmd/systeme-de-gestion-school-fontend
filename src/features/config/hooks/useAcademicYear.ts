import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AcademicYearService, AcademicYear, EvaluationPeriod } from "@/services/academic-year.service";
import { SchoolService } from "@/services/school.service";
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

  const createYearMutation = useMutation({
    mutationFn: (data: Partial<AcademicYear>) => AcademicYearService.createYear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      toast.success("Année scolaire créée");
    },
    onError: () => toast.error("Erreur lors de la création de l'année")
  });

  const updateYearMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<AcademicYear> }) => 
      AcademicYearService.updateYear(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      toast.success("Année scolaire mise à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour de l'année")
  });

  const createPeriodMutation = useMutation({
    mutationFn: (data: Partial<EvaluationPeriod>) => AcademicYearService.createPeriod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation-periods"] });
      toast.success("Période créée");
    },
    onError: () => toast.error("Erreur lors de la création de la période")
  });

  const updatePeriodMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<EvaluationPeriod> }) => 
      AcademicYearService.updatePeriod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation-periods"] });
      toast.success("Période mise à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour de la période")
  });

  const setYearActiveMutation = useMutation({
    mutationFn: (yearId: number) => SchoolService.setActiveYear(yearId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      queryClient.invalidateQueries({ queryKey: ["school-config"] });
      toast.success("Année active mise à jour");
    },
    onError: () => {
      toast.error("Erreur lors du changement d'année active");
    }
  });

  return {
    years,
    activeYear,
    periods,
    isLoading: isLoadingYears || isLoadingPeriods,
    setActiveYear: (yearId: number) => setYearActiveMutation.mutate(yearId),
    createYear: (data: Partial<AcademicYear>) => createYearMutation.mutate(data),
    updateYear: (id: number, data: Partial<AcademicYear>) => updateYearMutation.mutate({ id, data }),
    createPeriod: (data: Partial<EvaluationPeriod>) => createPeriodMutation.mutate(data),
    updatePeriod: (id: number, data: Partial<EvaluationPeriod>) => updatePeriodMutation.mutate({ id, data }),
    isSettingActive: setYearActiveMutation.isPending,
    isCreatingYear: createYearMutation.isPending,
    isUpdatingYear: updateYearMutation.isPending,
    isCreatingPeriod: createPeriodMutation.isPending,
    isUpdatingPeriod: updatePeriodMutation.isPending
  };
}

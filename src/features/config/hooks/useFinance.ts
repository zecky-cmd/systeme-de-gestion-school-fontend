import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FinanceService, CreateRubriqueFinanciereDto, CreateCategorieTarifaireDto, CopierTarifsDto } from "@/services/finance.service";
import { SchoolService } from "@/services/school.service";
import { toast } from "sonner";


export function useFinance() {
  const queryClient = useQueryClient();

  // 1. Récupérer la configuration de l'établissement (pour obtenir l'année active)
  const { data: schoolConfig } = useQuery({
    queryKey: ["school-config"],
    queryFn: SchoolService.getConfig,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const anneeActiveId = schoolConfig?.anneeActiveId;

  // 2. Récupérer les catégories tarifaires
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["finance-categories"],
    queryFn: FinanceService.getCategories
  });

  // 3. Récupérer les rubriques financières (filtrées par année scolaire active si dispo)
  const { data: rubrics = [], isLoading: isLoadingRubrics } = useQuery({
    queryKey: ["finance-rubrics", anneeActiveId],
    queryFn: () => FinanceService.getRubrics(anneeActiveId),
    enabled: !!anneeActiveId
  });

  // 4. Mutations pour les catégories tarifaires
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategorieTarifaireDto) => FinanceService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance-categories"] });
      toast.success("Catégorie tarifaire créée avec succès");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Erreur lors de la création de la catégorie");
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCategorieTarifaireDto> }) => 
      FinanceService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance-categories"] });
      toast.success("Catégorie tarifaire mise à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la catégorie");
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => FinanceService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance-categories"] });
      toast.success("Catégorie tarifaire supprimée avec succès");
    },
    onError: () => {
      toast.error("Impossible de supprimer la catégorie (elle est peut-être utilisée)");
    }
  });

  // 5. Mutations pour les rubriques financières
  const createRubricMutation = useMutation({
    mutationFn: (data: CreateRubriqueFinanciereDto) => FinanceService.createRubric(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance-rubrics"] });
      toast.success("Rubrique financière créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la rubrique");
    }
  });

  const updateRubricMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      FinanceService.updateRubric(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance-rubrics"] });
      toast.success("Rubrique financière mise à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la rubrique");
    }
  });

  const deleteRubricMutation = useMutation({
    mutationFn: (id: number) => FinanceService.deleteRubric(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance-rubrics"] });
      toast.success("Rubrique financière supprimée avec succès");
    },
    onError: () => {
      toast.error("Impossible de supprimer la rubrique (elle est peut-être déjà utilisée)");
    }
  });

  // 6. Mutation pour dupliquer les tarifs
  const copyTariffsMutation = useMutation({
    mutationFn: (data: CopierTarifsDto) => FinanceService.copyTariffs(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance-rubrics"] });
      toast.success("Tarifs dupliqués avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la duplication des tarifs");
    }
  });

  return {
    anneeActiveId,
    categories,
    rubrics,
    isLoading: isLoadingCategories || isLoadingRubrics,
    
    // Actions catégories
    createCategory: (data: CreateCategorieTarifaireDto) => createCategoryMutation.mutateAsync(data),
    updateCategory: (id: number, data: Partial<CreateCategorieTarifaireDto>) => updateCategoryMutation.mutateAsync({ id, data }),
    deleteCategory: (id: number) => deleteCategoryMutation.mutateAsync(id),
    
    // Actions rubriques
    createRubric: (data: CreateRubriqueFinanciereDto) => createRubricMutation.mutateAsync(data),
    updateRubric: (id: number, data: any) => updateRubricMutation.mutateAsync({ id, data }),
    deleteRubric: (id: number) => deleteRubricMutation.mutateAsync(id),
    
    // Actions globales
    copyTariffs: (data: CopierTarifsDto) => copyTariffsMutation.mutateAsync(data),
    isCopying: copyTariffsMutation.isPending
  };
}

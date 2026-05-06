import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PedagogyService, SubjectCoefficient } from "@/services/pedagogy.service";
import { MatiereService, Matiere } from "@/services/matiere.service";
import { ClasseService } from "@/services/classe.service";
import { SchoolService } from "@/services/school.service";
import { toast } from "sonner";

export function usePedagogy() {
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["pedagogy-subjects"],
    queryFn: PedagogyService.getPedagogyData
  });

  const subjects = data?.subjects ?? [];
  const levels = data?.levels ?? [];

  const { data: config } = useQuery({
    queryKey: ["school-config"],
    queryFn: SchoolService.getConfig
  });

  const updateConfigMutation = useMutation({
    mutationFn: (newConfig: any) => SchoolService.updateConfig(newConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-config"] });
      toast.success("Configuration mise à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour")
  });

  const updateLogoMutation = useMutation({
    mutationFn: (file: File) => SchoolService.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-config"] });
      toast.success("Logo mis à jour");
    },
    onError: () => toast.error("Erreur lors du téléchargement")
  });

  const createSubjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const { coefficients, ...matiereData } = data;
      const newMatiere = await MatiereService.create(matiereData);
      
      if (coefficients && Object.keys(coefficients).length > 0) {
        await PedagogyService.updateAllCoefficients([{
          id: newMatiere.id,
          matiere: newMatiere.nom,
          code: newMatiere.code,
          groupe: data.groupe || "Général",
          coefficients
        }]);
      }
      return newMatiere;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-subjects"] });
      toast.success("Matière ajoutée");
    },
    onError: () => toast.error("Erreur lors de la création")
  });

  const updateSubjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Matiere> }) => 
      MatiereService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-subjects"] });
      toast.success("Matière mise à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour")
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: (id: number) => MatiereService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-subjects"] });
      toast.success("Matière supprimée");
    },
    onError: () => toast.error("Erreur lors de la suppression")
  });

  const createLevelMutation = useMutation({
    mutationFn: async (data: { nom: string, cycle: "col" | "lyc" }) => {
      const config = await SchoolService.getConfig();
      if (!config.anneeActiveId) throw new Error("Aucune année scolaire active");
      
      return ClasseService.create({
        nom: `Réf. ${data.nom}`,
        niveau: data.nom,
        cycle: data.cycle,
        anneeId: config.anneeActiveId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-subjects"] });
      toast.success("Niveau ajouté");
    },
    onError: (err: any) => toast.error(err.message || "Erreur lors de l'ajout du niveau")
  });

  const deleteLevelMutation = useMutation({
    mutationFn: async (level: string) => {
      const classes = await ClasseService.getAll();
      const classesToDelete = classes.filter(c => c.niveau === level);
      await Promise.all(classesToDelete.map(c => ClasseService.delete(c.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-subjects"] });
      toast.success("Niveau supprimé");
    },
    onError: () => toast.error("Erreur lors de la suppression du niveau")
  });

  const updateCoefficientsMutation = useMutation({
    mutationFn: (allSubjects: SubjectCoefficient[]) => 
      PedagogyService.updateAllCoefficients(allSubjects),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-subjects"] });
      toast.success("Coefficients enregistrés");
    },
    onError: () => toast.error("Erreur lors de l'enregistrement")
  });

  return {
    config,
    subjects,
    levels,
    isLoading: isLoadingSubjects,
    updateConfig: (newConfig: any) => updateConfigMutation.mutate(newConfig),
    updateLogo: (file: File) => updateLogoMutation.mutate(file),
    createSubject: (data: any) => createSubjectMutation.mutate(data),
    updateSubject: (id: number, data: Partial<Matiere>) => updateSubjectMutation.mutate({ id, data }),
    deleteSubject: (id: number) => deleteSubjectMutation.mutate(id),
    createLevel: (data: { nom: string, cycle: "col" | "lyc" }) => createLevelMutation.mutate(data),
    deleteLevel: (level: string) => deleteLevelMutation.mutate(level),
    updateCoefficients: (allSubjects: SubjectCoefficient[]) => updateCoefficientsMutation.mutate(allSubjects),
    isSaving: updateConfigMutation.isPending || 
              updateLogoMutation.isPending || 
              createSubjectMutation.isPending || 
              updateSubjectMutation.isPending || 
              deleteSubjectMutation.isPending ||
              createLevelMutation.isPending ||
              deleteLevelMutation.isPending ||
              updateCoefficientsMutation.isPending
  };
}

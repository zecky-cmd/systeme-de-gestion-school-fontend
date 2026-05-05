import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PedagogyService, SubjectCoefficient, NoteType } from "@/services/pedagogy.service";
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

  const { data: noteTypes = [], isLoading: isLoadingNotes } = useQuery({
    queryKey: ["pedagogy-note-types"],
    queryFn: PedagogyService.getNoteTypes
  });

  const createSubjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const { coefficients, ...matiereData } = data;
      // 1. Créer la matière
      const newMatiere = await MatiereService.create(matiereData);
      
      // 2. Si des coefficients sont fournis, les enregistrer
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
      toast.success("Matiere et coefficients enregistres");
    },
    onError: () => toast.error("Erreur lors de la creation")
  });

  const updateSubjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Matiere> }) => 
      MatiereService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-subjects"] });
      toast.success("Matiere mise a jour");
    },
    onError: () => toast.error("Erreur lors de la mise a jour")
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: (id: number) => MatiereService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-subjects"] });
      toast.success("Matiere supprimee");
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
      toast.success("Coefficients mis a jour");
    },
    onError: () => toast.error("Erreur lors de la mise a jour des coefficients")
  });

  const updateNoteTypesMutation = useMutation({
    mutationFn: (allNoteTypes: NoteType[]) => 
      PedagogyService.updateAllNoteTypes(allNoteTypes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedagogy-note-types"] });
      toast.success("Poids des notes mis a jour");
    },
    onError: () => toast.error("Erreur lors de la mise a jour des poids")
  });

  return {
    subjects,
    levels,
    noteTypes,
    isLoading: isLoadingSubjects || isLoadingNotes,
    createSubject: (data: Partial<Matiere>) => createSubjectMutation.mutate(data),
    updateSubject: (id: number, data: Partial<Matiere>) => updateSubjectMutation.mutate({ id, data }),
    deleteSubject: (id: number) => deleteSubjectMutation.mutate(id),
    createLevel: (data: { nom: string, cycle: "col" | "lyc" }) => createLevelMutation.mutate(data),
    deleteLevel: (level: string) => deleteLevelMutation.mutate(level),
    updateCoefficients: (allSubjects: SubjectCoefficient[]) => updateCoefficientsMutation.mutate(allSubjects),
    updateNoteTypes: (allNoteTypes: NoteType[]) => updateNoteTypesMutation.mutate(allNoteTypes),
    isSaving: updateCoefficientsMutation.isPending || 
              updateNoteTypesMutation.isPending || 
              createSubjectMutation.isPending || 
              updateSubjectMutation.isPending || 
              deleteSubjectMutation.isPending ||
              createLevelMutation.isPending ||
              deleteLevelMutation.isPending
  };
}

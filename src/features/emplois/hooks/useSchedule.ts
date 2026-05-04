import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScheduleService, DayOfWeek } from "@/services/schedule.service";
import { toast } from "sonner";
import { REV_DAYS_MAP } from "../constants/schedule.constants";

export function useSchedule(selectedClasseId: string) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal Form State
  const [formData, setFormData] = useState({
    day: "lun" as DayOfWeek,
    hourRange: "07h30 - 08h30",
    matiereId: "",
    affectationId: "",
    room: ""
  });

  // Fetch Créneaux
  const { data: slots = [], isLoading: isSlotsLoading } = useQuery({
    queryKey: ["creneaux", selectedClasseId],
    queryFn: () => ScheduleService.getAll(parseInt(selectedClasseId)),
    enabled: !!selectedClasseId
  });

  // Mutations
  const createSlotMutation = useMutation({
    mutationFn: ScheduleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creneaux"] });
      setIsModalOpen(false);
      toast.success("Cours ajouté !");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Erreur lors de l'ajout")
  });

  const deleteSlotMutation = useMutation({
    mutationFn: ScheduleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creneaux"] });
      toast.success("Cours supprimé !");
    },
    onError: (error: any) => toast.error("Erreur lors de la suppression")
  });

  const openAddModal = (dayLabel?: string, hourRange?: string) => {
    setFormData({
      day: dayLabel ? REV_DAYS_MAP[dayLabel] : "lun",
      hourRange: hourRange || "07h30 - 08h30",
      matiereId: "",
      affectationId: "",
      room: ""
    });
    setIsModalOpen(true);
  };

  const handleAddCourse = () => {
    if (!formData.affectationId) return;
    const [start, end] = formData.hourRange.split(" - ");
    createSlotMutation.mutate({
      matiereNiveauId: parseInt(formData.affectationId),
      jour: formData.day,
      heureDebut: `2024-01-01T${start.replace("h", ":")}:00.000Z`,
      heureFin: `2024-01-01T${end.replace("h", ":")}:00.000Z`,
      salle: formData.room
    });
  };

  return {
    slots,
    isSlotsLoading,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    openAddModal,
    handleAddCourse,
    deleteSlot: deleteSlotMutation.mutate,
    isPending: createSlotMutation.isPending
  };
}

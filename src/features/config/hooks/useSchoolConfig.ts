import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SchoolService, SchoolConfig } from "@/services/school.service";
import { toast } from "sonner";

export function useSchoolConfig() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<SchoolConfig>>({
    nomComplet: "",
    sigle: "",
    agrementMena: "",
    typeEtablissement: "Prive laique",
    adresse: "",
    ville: "",
    telephone: "",
    email: "",
    directeur: "",
  });

  const { data: config, isLoading } = useQuery({
    queryKey: ["school-config"],
    queryFn: SchoolService.getConfig,
    retry: false
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const updateMutation = useMutation({
    mutationFn: SchoolService.updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-config"] });
      toast.success("Configuration mise à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const handleInputChange = (field: keyof SchoolConfig, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSave,
    isSaving: updateMutation.isPending
  };
}

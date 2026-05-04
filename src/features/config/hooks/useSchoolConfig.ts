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

  const uploadLogoMutation = useMutation({
    mutationFn: SchoolService.uploadLogo,
    onSuccess: (url) => {
      setFormData(prev => ({ ...prev, logoUrl: url }));
      queryClient.invalidateQueries({ queryKey: ["school-config"] });
      toast.success("Logo mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de l'upload du logo");
    }
  });

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

  const handleLogoUpload = (file: File) => {
    uploadLogoMutation.mutate(file);
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSave,
    handleLogoUpload,
    isSaving: updateMutation.isPending || uploadLogoMutation.isPending
  };
}

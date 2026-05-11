import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserManagementService, ConfigUser } from "@/services/user-management.service";
import { toast } from "sonner";

export function useUserManagement() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["config-users"],
    queryFn: () => UserManagementService.getUsers()
  });

  const permissions = UserManagementService.getPermissions();

  const createUserMutation = useMutation({
    mutationFn: (data: Partial<ConfigUser>) => UserManagementService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config-users"] });
      toast.success("Utilisateur créé avec succès");
    },
    onError: () => toast.error("Erreur lors de la création de l'utilisateur")
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ConfigUser> }) => 
      UserManagementService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config-users"] });
      toast.success("Utilisateur mis à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour")
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => UserManagementService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config-users"] });
      toast.success("Utilisateur supprimé");
    },
    onError: () => toast.error("Erreur lors de la suppression")
  });

  return {
    users,
    permissions,
    isLoading: isLoadingUsers,
    isSaving: createUserMutation.isPending || updateUserMutation.isPending || deleteUserMutation.isPending,
    createUser: createUserMutation.mutate,
    updateUser: (id: number, data: Partial<ConfigUser>) => updateUserMutation.mutate({ id, data }),
    deleteUser: deleteUserMutation.mutate
  };
}

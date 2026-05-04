import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserManagementService } from "@/services/user-management.service";
import { toast } from "sonner";

export function useUserManagement() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["config-users"],
    queryFn: UserManagementService.getUsers
  });

  const { data: permissions = [], isLoading: isLoadingPerms } = useQuery({
    queryKey: ["config-permissions"],
    queryFn: UserManagementService.getPermissions
  });

  const updatePermMutation = useMutation({
    mutationFn: ({ func, role, value }: { func: string; role: string; value: boolean }) => 
      UserManagementService.updatePermission(func, role, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config-permissions"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la permission");
    }
  });

  return {
    users,
    permissions,
    isLoading: isLoadingUsers || isLoadingPerms,
    togglePermission: (func: string, role: string, value: boolean) => 
      updatePermMutation.mutate({ func, role, value })
  };
}

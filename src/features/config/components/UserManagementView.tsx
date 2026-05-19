import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ShieldCheck, Info } from "lucide-react";
import { useUserManagement, useUserById } from "../hooks/useUserManagement";
import { useUserManagementView } from "./users/useUserManagementView";
import { UserAccountsTab } from "./users/UserAccountsTab";
import { PermissionsMatrixTab } from "./users/PermissionsMatrixTab";
import { UserModal } from "./users/modals/UserModal";
import { DeleteConfirmModal } from "./users/modals/DeleteConfirmModal";
import { UserProfileModal } from "./users/modals/UserProfileModal";
import { Skeleton } from "@/components/ui/skeleton";

export function UserManagementView() {
  const {
    users,
    permissions,
    isLoading,
    createUser,
    updateUser,
    deleteUser
  } = useUserManagement();

  const {
    searchQuery,
    setSearchQuery,
    filteredUsers,
    isUserModalOpen,
    isDeleteModalOpen,
    selectedProfileId,
    selectedUser,
    handlers
  } = useUserManagementView({ users });

  // Consommation dynamique de l'API unitaire (getUserById) via notre hook React Query
  const { data: detailedUser, isLoading: isLoadingProfile } = useUserById(selectedProfileId);

  const handleUserSubmit = (data: any) => {
    if (selectedUser?.id) {
      updateUser(selectedUser.id, data);
    } else {
      createUser(data);
    }
    handlers.closeModals();
  };

  const handleDeleteConfirm = () => {
    if (selectedUser?.id) {
      deleteUser(selectedUser.id);
    }
    handlers.closeModals();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="accounts" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-100/80 p-1 border border-slate-200">
            <TabsTrigger 
              value="accounts" 
              className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm gap-2"
            >
              <Users size={16} />
              Comptes Utilisateurs
            </TabsTrigger>
            <TabsTrigger 
              value="permissions" 
              className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm gap-2"
            >
              <ShieldCheck size={16} />
              Matrice des Permissions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="accounts" className="mt-0 focus-visible:outline-none">
          <UserAccountsTab 
            users={filteredUsers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddClick={handlers.openAddUser}
            onEditClick={handlers.openEditUser}
            onDeleteClick={handlers.openDeleteConfirm}
            onViewProfileClick={handlers.openUserProfile}
          />
        </TabsContent>

        <TabsContent value="permissions" className="mt-0 focus-visible:outline-none">
          <PermissionsMatrixTab permissions={permissions} />
        </TabsContent>
      </Tabs>

      <UserModal 
        isOpen={isUserModalOpen}
        onClose={handlers.closeModals}
        onSubmit={handleUserSubmit}
        user={selectedUser}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handlers.closeModals}
        onConfirm={handleDeleteConfirm}
        userName={selectedUser ? `${selectedUser.nom} ${selectedUser.prenom}` : undefined}
      />

      <UserProfileModal
        isOpen={!!selectedProfileId}
        onClose={handlers.closeModals}
        user={detailedUser || null}
        isLoading={isLoadingProfile}
      />
    </div>
  );
}

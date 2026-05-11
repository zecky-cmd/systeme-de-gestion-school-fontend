import { useState, useMemo } from "react";
import { ConfigUser } from "@/services/user-management.service";

interface UseUserManagementViewProps {
  users: ConfigUser[];
}

export function useUserManagementView({ users }: UseUserManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ConfigUser | null>(null);

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter(user => 
      user.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handlers = {
    openAddUser: () => {
      setSelectedUser(null);
      setIsUserModalOpen(true);
    },
    openEditUser: (user: ConfigUser) => {
      setSelectedUser(user);
      setIsUserModalOpen(true);
    },
    closeModals: () => {
      setIsUserModalOpen(false);
      setSelectedUser(null);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredUsers,
    isUserModalOpen,
    selectedUser,
    handlers
  };
}

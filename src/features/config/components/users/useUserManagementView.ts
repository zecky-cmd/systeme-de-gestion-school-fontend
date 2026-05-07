import { useState, useMemo } from "react";
import { ConfigUser, PermissionRow } from "@/services/user-management.service";

export const ROLE_LABELS: Record<string, string> = {
  "adm": "Administrateur",
  "dir": "Directeur",
  "ens": "Enseignant",
  "par": "Parent",
  "elv": "Élève"
};

interface UseUserManagementViewProps {
  users: ConfigUser[];
  permissions: PermissionRow[];
}

export function useUserManagementView({ users, permissions }: UseUserManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("accounts");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ConfigUser | null>(null);

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    const usersArray = Array.isArray(users) ? users : [];
    if (!searchQuery) return usersArray;
    const lowQuery = searchQuery.toLowerCase();
    return usersArray.filter(u => {
      const roleLabel = ROLE_LABELS[u.role] || u.role;
      return u.nom.toLowerCase().includes(lowQuery) || 
             u.email.toLowerCase().includes(lowQuery) ||
             roleLabel.toLowerCase().includes(lowQuery);
    });
  }, [users, searchQuery]);

  // Extraction dynamique des rôles à partir de la matrice des permissions
  const availableRoles = useMemo(() => {
    if (permissions.length === 0) return [];
    // On prend les clés du premier objet roles pour avoir la liste des rôles configurés en DB
    return Object.keys(permissions[0].roles);
  }, [permissions]);

  const handlers = {
    openAddUser: () => {
      setSelectedUser(null);
      setIsUserModalOpen(true);
    },
    openEditUser: (user: ConfigUser) => {
      setSelectedUser(user);
      setIsUserModalOpen(true);
    },
    closeUserModal: () => {
      setSelectedUser(null);
      setIsUserModalOpen(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredUsers,
    availableRoles,
    isUserModalOpen,
    selectedUser,
    handlers
  };
}

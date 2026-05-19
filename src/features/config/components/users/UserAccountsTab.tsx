import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2, 
  User as UserIcon,
  Shield,
  GraduationCap,
  Users as UsersIcon,
  Baby,
  MoreHorizontal,
  Eye,
  CreditCard,
  FileText
} from "lucide-react";
import { ConfigUser } from "@/services/user-management.service";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserAccountsTabProps {
  users: ConfigUser[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
  onEditClick: (user: ConfigUser) => void;
  onDeleteClick: (user: ConfigUser) => void;
  onViewProfileClick: (user: ConfigUser) => void;
}

export function UserAccountsTab({ 
  users, 
  searchQuery, 
  onSearchChange, 
  onAddClick, 
  onEditClick,
  onDeleteClick,
  onViewProfileClick
}: UserAccountsTabProps) {
  
  const getRoleInfo = (role: string) => {
    switch (role) {
      case "adm": return { label: "Admin", color: "bg-red-100 text-red-700", icon: Shield };
      case "dir": return { label: "Directeur", color: "bg-purple-100 text-purple-700", icon: UserIcon };
      case "ens": return { label: "Enseignant", color: "bg-blue-100 text-blue-700", icon: GraduationCap };
      case "par": return { label: "Parent", color: "bg-orange-100 text-orange-700", icon: Baby };
      case "elv": return { label: "Élève", color: "bg-green-100 text-green-700", icon: UsersIcon };
      default: return { label: role, color: "bg-slate-100 text-slate-700", icon: UserIcon };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Rechercher un utilisateur..." 
            className="pl-10 bg-white border-slate-200 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={onAddClick} className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-sm">
          <UserPlus size={18} />
          Nouvel Utilisateur
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Utilisateur</TableHead>
              <TableHead className="font-semibold text-slate-700">Email</TableHead>
              <TableHead className="font-semibold text-slate-700">Rôle</TableHead>
              <TableHead className="font-semibold text-slate-700">Statut</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const roleInfo = getRoleInfo(user.role);
                const Icon = roleInfo.icon;
                return (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
                          ) : (
                            <UserIcon size={18} />
                          )}
                        </div>
                        <span className="font-medium text-slate-900">{user.nom} {user.prenom}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={`${roleInfo.color} border-none font-medium flex items-center gap-1 w-fit shadow-none`}>
                        <Icon size={12} />
                        {roleInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.estActif !== false ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none font-medium">
                          Actif
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none shadow-none font-medium">
                          Inactif
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent p-0 text-slate-500 hover:bg-slate-100 focus:outline-none cursor-pointer ml-auto">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 p-2 rounded-xl">
                          <DropdownMenuItem className="cursor-pointer gap-3 text-slate-700 font-medium py-2" onClick={() => onViewProfileClick(user)}>
                            <Eye className="h-4 w-4 text-slate-500" />
                            <span>Voir le profil</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-3 text-slate-700 font-medium py-2" onClick={() => onEditClick(user)}>
                            <Edit2 className="h-4 w-4 text-slate-500" />
                            <span>Modifier</span>
                          </DropdownMenuItem>       
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem className="cursor-pointer gap-3 text-red-600 font-medium focus:text-red-600 focus:bg-red-50 py-2" onClick={() => onDeleteClick(user)}>
                            <Trash2 className="h-4 w-4" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

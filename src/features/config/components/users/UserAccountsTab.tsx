import React from "react";
import { Search, Plus, Edit2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConfigUser } from "@/services/user-management.service";
import { ROLE_LABELS } from "./useUserManagementView";

interface UserAccountsTabProps {
  users: ConfigUser[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onAddClick: () => void;
  onEditClick: (user: ConfigUser) => void;
}

export function UserAccountsTab({
  users,
  searchQuery,
  onSearchChange,
  onAddClick,
  onEditClick
}: UserAccountsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Rechercher un utilisateur..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 rounded-xl border-slate-200 h-11 bg-white shadow-sm"
          />
        </div>
        <Button 
          onClick={onAddClick}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 rounded-xl h-11 px-6 shadow-lg shadow-emerald-900/10 transition-all active:scale-95"
        >
          <Plus size={20} /> Nouvel utilisateur
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-100">
              <TableHead className="font-bold text-slate-900 px-6 h-12 text-xs uppercase tracking-wider">Utilisateur</TableHead>
              <TableHead className="font-bold text-slate-900 h-12 text-xs uppercase tracking-wider">Email</TableHead>
              <TableHead className="font-bold text-slate-900 h-12 text-xs uppercase tracking-wider">Rôle</TableHead>
              <TableHead className="font-bold text-slate-900 h-12 text-xs uppercase tracking-wider">Statut</TableHead>
              <TableHead className="font-bold text-slate-900 h-12 text-xs uppercase tracking-wider text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">
                        {user.nom.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{user.nom}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Dernier accès: {user.dernierAcces}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-600 font-medium">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-md border-slate-200 bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-0.5">
                    {ROLE_LABELS[user.role] || user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${user.statut === 'Actif' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`} />
                    <span className="text-xs font-bold text-slate-700">{user.statut}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                      onClick={() => onEditClick(user)}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Lock size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

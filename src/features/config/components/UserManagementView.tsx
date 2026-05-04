import React from "react";
import { Plus, Edit2, Lock, Check, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ConfigUser, PermissionRow } from "@/services/user-management.service";

interface UserManagementViewProps {
  users: ConfigUser[];
  permissions: PermissionRow[];
  onTogglePermission: (func: string, role: string, value: boolean) => void;
}

const ROLES_ORDER = ["Directeur", "Secretaire", "Comptable", "Enseignant", "Parent"];

export function UserManagementView({ users, permissions, onTogglePermission }: UserManagementViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Comptes Utilisateurs */}
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 gap-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">Comptes utilisateurs</CardTitle>
            <CardDescription className="text-xs">Gestion des accès et des rôles</CardDescription>
          </div>
          <div className="flex items-center gap-2">
             <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                <Input placeholder="Rechercher..." className="pl-8 h-8 w-[160px] md:w-[200px] rounded-md border-slate-200 text-xs" />
             </div>
             <Button size="sm" className="h-8 rounded-md bg-primary hover:bg-primary/90 text-white font-semibold px-3 gap-1.5 text-xs">
                <Plus size={14} /> Nouveau
             </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 border-t border-slate-100">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[10px] font-semibold uppercase py-3 px-6">Utilisateur</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase">Email</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase text-center">Rôle</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase text-center">Statut</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase">Dernier accès</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/30 transition-colors group">
                    <TableCell className="py-2.5 px-6">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 bg-primary/10 border-none shadow-none">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback className="bg-transparent text-primary text-[10px] font-bold">
                            {user.nom.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-slate-700">{user.nom}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold px-2 h-4 border",
                        user.role === "Directeur" ? "border-primary/30 bg-primary/5 text-primary" :
                        user.role === "Administrateur" ? "border-red-200 bg-red-50 text-red-700" :
                        "border-slate-200 bg-slate-50 text-slate-500"
                      )}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                         <div className={cn("h-1.5 w-1.5 rounded-full", user.statut === "Actif" ? "bg-green-500" : "bg-muted-foreground")} />
                         <span className="text-[10px] font-medium text-slate-500">
                           {user.statut}
                         </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] text-slate-400 font-mono">{user.dernierAcces}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded text-slate-400">
                          <Edit2 size={12} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded text-slate-400 hover:text-destructive">
                          <Lock size={12} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Matrice des Permissions */}
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Matrice des permissions</CardTitle>
          <CardDescription className="text-xs">Droits d'accès par rôle (conforme au CDC)</CardDescription>
        </CardHeader>
        <CardContent className="p-0 border-t border-slate-100">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[10px] font-semibold uppercase py-4 px-6 w-[240px]">Fonctionnalité</TableHead>
                  {ROLES_ORDER.map(role => (
                    <TableHead key={role} className="text-[10px] font-semibold uppercase text-center">{role}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((row) => (
                  <TableRow key={row.fonctionnalite} className="border-slate-100 hover:bg-slate-50/30 transition-colors">
                    <TableCell className="py-3 px-6 text-[11px] font-medium text-slate-700 uppercase tracking-tight">{row.fonctionnalite}</TableCell>
                    {ROLES_ORDER.map(role => (
                      <TableCell key={role} className="text-center">
                        <div 
                          onClick={() => onTogglePermission(row.fonctionnalite, role, !row.roles[role])}
                          className="flex items-center justify-center cursor-pointer"
                        >
                          {row.roles[role] 
                            ? <Check className="h-3.5 w-3.5 text-primary" /> 
                            : <X className="h-3.5 w-3.5 text-muted-foreground" />
                          }
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

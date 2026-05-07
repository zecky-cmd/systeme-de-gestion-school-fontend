import React from "react";
import { Check, X } from "lucide-react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { PermissionRow } from "@/services/user-management.service";
import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "./useUserManagementView";

interface PermissionsMatrixTabProps {
  permissions: PermissionRow[];
  roles: string[];
  onToggle: (func: string, role: string, value: boolean) => void;
}

export function PermissionsMatrixTab({
  permissions,
  roles,
  onToggle
}: PermissionsMatrixTabProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-100">
            <TableHead className="font-bold text-slate-900 px-6 h-12 text-xs uppercase tracking-wider">Fonctionnalité</TableHead>
            {roles.map(role => (
              <TableHead key={role} className="font-bold text-slate-900 h-12 text-xs uppercase tracking-wider text-center">
                {ROLE_LABELS[role] || role}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((row) => (
            <TableRow key={row.fonctionnalite} className="hover:bg-slate-50/50 transition-colors border-slate-100">
              <TableCell className="px-6 py-4 font-bold text-slate-700 text-sm">
                {row.fonctionnalite}
              </TableCell>
              {roles.map(role => {
                const hasAccess = row.roles[role];
                return (
                  <TableCell key={role} className="text-center p-0">
                    <button 
                      onClick={() => onToggle(row.fonctionnalite, role, !hasAccess)}
                      className={cn(
                        "w-full h-12 flex items-center justify-center transition-all",
                        hasAccess 
                          ? "text-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/30" 
                          : "text-slate-300 hover:text-slate-400 hover:bg-slate-50"
                      )}
                    >
                      {hasAccess ? (
                        <Check size={20} strokeWidth={3} className="drop-shadow-sm" />
                      ) : (
                        <X size={16} strokeWidth={2} />
                      )}
                    </button>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

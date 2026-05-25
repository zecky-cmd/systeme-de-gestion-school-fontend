import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PermissionRow } from "@/services/user-management.service";
import { Check, X, Info } from "lucide-react";
// import { 
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

interface PermissionsMatrixTabProps {
  permissions: PermissionRow[];
}

export function PermissionsMatrixTab({ permissions }: PermissionsMatrixTabProps) {
  const roles = ["adm", "dir", "ens", "par", "elv"];
  const roleLabels: Record<string, string> = {
    "adm": "Admin",
    "dir": "Directeur",
    "ens": "Enseignant",
    "par": "Parent",
    "elv": "Élève"
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-sm">
        <Info size={18} className="shrink-0" />
        <p>
          Cette matrice affiche les droits d'accès fixés par le système. 
          Les permissions sont basées sur le rôle et la possession des données.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700 w-[300px]">Fonctionnalité</TableHead>
              {roles.map(role => (
                <TableHead key={role} className="text-center font-semibold text-slate-700">
                  {roleLabels[role]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((row, idx) => (
              <TableRow key={idx} className="hover:bg-slate-50/20 transition-colors">
                <TableCell className="font-medium text-slate-900">
                  {row.fonctionnalite}
                </TableCell>
                {roles.map(role => {
                  const hasAccess = row.roles[role];
                  return (
                    <TableCell key={role} className="text-center">
                      <div className="flex justify-center">
                        {hasAccess ? (
                          <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                            <Check size={14} />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                            <X size={14} />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="pt-4 text-xs text-slate-500 italic">
        * Certaines permissions (Saisie des notes, Consultation) sont filtrées dynamiquement selon l'affectation réelle de l'utilisateur.
      </div>
    </div>
  );
}

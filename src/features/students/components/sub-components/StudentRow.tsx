"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { StudentIdentityCell } from "./StudentIdentityCell";
import { getStudentClasseName } from "@/features/students/utils/student-display.utils";
import type { Eleve } from "@/services/student.service";
import { CreditCard, Eye, FileText, Pencil, Trash2 } from "lucide-react";

interface StudentRowProps {
  eleve: Eleve;
  onView: (student: Eleve) => void;
  onEdit: (student: Eleve) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function StudentRow({
  eleve,
  onView,
  onEdit,
  canEdit = true,
  canDelete = false,
}: StudentRowProps) {
  const menuItems = [
    {
      label: "Voir le profil",
      icon: <Eye className="h-4 w-4" />,
      onClick: () => onView(eleve),
    },
    ...(canEdit
      ? [
          {
            label: "Modifier",
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => onEdit(eleve),
          },
        ]
      : []),
    {
      label: "Situation financière",
      icon: <CreditCard className="h-4 w-4" />,
      onClick: () => onView(eleve),
    },
    {
      label: "Bulletin scolaire",
      icon: <FileText className="h-4 w-4" />,
      onClick: () => onView(eleve),
    },
    ...(canDelete
      ? [
          {
            label: "Supprimer",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => {},
            variant: "danger" as const,
          },
        ]
      : []),
  ];

  return (
    <TableRow
      key={eleve.id}
      className="hover:bg-muted/50 transition-colors group"
    >
      <TableCell className="font-medium text-muted-foreground">
        {eleve.matricule}
      </TableCell>
      <TableCell>
        <StudentIdentityCell eleve={eleve} />
      </TableCell>
      <TableCell>{getStudentClasseName(eleve)}</TableCell>
      <TableCell>{eleve.sexe}</TableCell>
      <TableCell>
        <StatusBadge status={eleve.statut || "Inscrit"} />
      </TableCell>
      <TableCell>
        <StatusBadge status={eleve.paiement || "Complet"} variant="payment" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end">
          <ActionMenu items={menuItems} />
        </div>
      </TableCell>
    </TableRow>
  );
}

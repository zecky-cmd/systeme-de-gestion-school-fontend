"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/shared/TablePagination";
import { StudentRow } from "./sub-components/StudentRow";
import { STUDENT_TABLE_COLUMN_COUNT } from "@/features/students/constants/students-list.constants";
import type { Eleve } from "@/services/student.service";

const HEADERS = [
  "MATRICULE",
  "NOM & PRENOM",
  "CLASSE",
  "SEXE",
  "STATUT",
  "PAIEMENT",
  "ACTIONS",
] as const;

interface StudentsTableProps {
  students: Eleve[];
  isLoading?: boolean;
  currentPage: number;
  totalFiltered: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onView: (student: Eleve) => void;
  onEdit: (student: Eleve) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function StudentsTable({
  students,
  isLoading,
  currentPage,
  totalFiltered,
  itemsPerPage,
  onPageChange,
  onView,
  onEdit,
  canEdit,
  canDelete,
}: StudentsTableProps) {
  if (isLoading) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {HEADERS.map((label, index) => (
                <TableHead
                  key={label}
                  className={
                    index === 0
                      ? "w-[150px] font-semibold"
                      : index === HEADERS.length - 1
                        ? "text-right font-semibold"
                        : "font-semibold"
                  }
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={STUDENT_TABLE_COLUMN_COUNT}
                  className="h-32 text-center text-muted-foreground italic"
                >
                  Aucun élève trouvé.
                </TableCell>
              </TableRow>
            ) : (
              students.map((eleve) => (
                <StudentRow
                  key={eleve.id}
                  eleve={eleve}
                  onView={onView}
                  onEdit={onEdit}
                  canEdit={canEdit}
                  canDelete={canDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        currentPage={currentPage}
        totalItems={totalFiltered}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        itemLabel="élèves"
      />
    </div>
  );
}

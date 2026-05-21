"use client";

import { AddStudentSheet } from "./AddStudentSheet";
import { StudentDetailSheet } from "./StudentDetailSheet";
import { EditStudentSheet } from "./EditStudentSheet";
import type { Eleve } from "@/services/student.service";

interface StudentSheetsProps {
  selectedStudent: Eleve | null;
  isAddOpen: boolean;
  isViewOpen: boolean;
  isEditOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
  onViewOpenChange: (open: boolean) => void;
  onEditOpenChange: (open: boolean) => void;
  onEditFromDetail: (student: Eleve) => void;
}

export function StudentSheets({
  selectedStudent,
  isAddOpen,
  isViewOpen,
  isEditOpen,
  onAddOpenChange,
  onViewOpenChange,
  onEditOpenChange,
  onEditFromDetail,
}: StudentSheetsProps) {
  return (
    <>
      <AddStudentSheet open={isAddOpen} onOpenChange={onAddOpenChange} />
      <StudentDetailSheet
        student={selectedStudent}
        open={isViewOpen}
        onOpenChange={onViewOpenChange}
        onEdit={onEditFromDetail}
      />
      <EditStudentSheet
        student={selectedStudent}
        open={isEditOpen}
        onOpenChange={onEditOpenChange}
      />
    </>
  );
}

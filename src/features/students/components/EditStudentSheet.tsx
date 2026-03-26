"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StudentService } from "@/services/student.service";
import { UserService } from "@/services/user.service";
import { ClasseService } from "@/services/classe.service";
import { StorageService } from "@/services/storage.service";
import { Loader2 } from "lucide-react";

// Reuse the modular pieces from the add flow
import { studentSchema, StudentFormValues } from "../schemas/student-form.schema";
import { PhotoUploadSection } from "./enrollment/PhotoUploadSection";
import { PersonalInfoSection } from "./enrollment/PersonalInfoSection";
import { AccountSection } from "./enrollment/AccountSection";
import { SchoolingSection } from "./enrollment/SchoolingSection";

interface EditStudentSheetProps {
  student: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStudentSheet({ student, open, onOpenChange }: EditStudentSheetProps) {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: ClasseService.getAll,
    enabled: open,
  });

  const methods = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "UNCHANGED", // Dummy value
      sexe: "M",
      matricule: "",
      classeId: "",
      photoUrl: "",
    },
  });

  const { handleSubmit, reset, setValue, formState: { isSubmitting } } = methods;

  // Pre-fill form when student changes
  useEffect(() => {
    if (student) {
      const nom = student.nom || student.user?.nom || "";
      const prenom = student.prenom || student.user?.prenom || "";
      const email = student.email || student.user?.email || "";
      
      reset({
        nom,
        prenom,
        email,
        password: "UNCHANGED", 
        sexe: student.sexe || "M",
        matricule: student.matricule || "",
        classeId: student.classe?.id?.toString() || "",
        photoUrl: student.photoUrl || "",
        dateNaissance: student.dateNaissance ? student.dateNaissance.split("T")[0] : "",
        lieuNaissance: student.lieuNaissance || "",
        nationalite: student.nationalite || "Ivoirienne",
      });
    }
  }, [student, reset]);

  const onSubmit = async (data: StudentFormValues) => {
    try {
      let finalPhotoUrl = data.photoUrl;

      if (selectedFile) {
        finalPhotoUrl = await StorageService.uploadProfilePhoto(selectedFile);
      }

      // Phase 1: Mise à jour du Compte Utilisateur (Identité)
      const userId = student.user?.id || student.userId;
      if (userId) {
        await UserService.update(userId, {
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
        });
      }

      // Phase 2: Mise à jour du Profil Élève
      await StudentService.update(student.id, {
        sexe: data.sexe,
        matricule: data.matricule,
        dateNaissance: data.dateNaissance || undefined,
        lieuNaissance: data.lieuNaissance,
        nationalite: data.nationalite,
        photoUrl: finalPhotoUrl || undefined,
      });

      queryClient.invalidateQueries({ queryKey: ["eleves"] });
      onOpenChange(false);
      alert("Élève mis à jour avec succès !");

    } catch (err: any) {
      console.error("❌ Échec:", err.response?.data || err.message);
      alert(`Erreur de mise à jour: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Modifier l'élève</SheetTitle>
          <SheetDescription>
            Mettez à jour les informations du profil de l'élève.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-4 py-6">
            <PhotoUploadSection 
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              localPreview={localPreview}
              setLocalPreview={setLocalPreview}
            />

            <PersonalInfoSection />
            
            <AccountSection 
              readonlyPassword={true}
            />
            
            <SchoolingSection classes={classes} />

            <SheetFooter className="pt-6 pb-2">
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base font-bold shadow-md shadow-emerald-500/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}

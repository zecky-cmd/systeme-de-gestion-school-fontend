import React, { useState } from "react";
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
import { AuthService } from "@/services/auth.service";
import { StudentService } from "@/services/student.service";
import { ClasseService } from "@/services/classe.service";
import { InscriptionService } from "@/services/inscription.service";
import { ConfigService } from "@/services/config.service";
import { StorageService } from "@/services/storage.service";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Refactored Components & Schema
import { studentSchema, StudentFormValues } from "../schemas/student-form.schema";
import { PhotoUploadSection } from "./enrollment/PhotoUploadSection";
import { PersonalInfoSection } from "./enrollment/PersonalInfoSection";
import { AccountSection } from "./enrollment/AccountSection";
import { SchoolingSection } from "./enrollment/SchoolingSection";

interface AddStudentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStudentSheet({ open, onOpenChange }: AddStudentSheetProps) {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Charger les données nécessaires
  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: () => ClasseService.getAll(),
    enabled: open,
  });

  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: ConfigService.getConfig,
    enabled: open,
  });

  const methods = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      sexe: "M",
      password: "Education2026!",
      nationalite: "Ivoirienne",
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: StudentFormValues) => {
    try {
      console.log("🚀 Lancement du flux d'inscription complet...");
      let finalPhotoUrl = data.photoUrl;

      if (selectedFile) {
        console.log("Phase 0: Upload de la photo...");
        finalPhotoUrl = await StorageService.uploadProfilePhoto(selectedFile);
      }

      console.log("Phase 1: Compte utilisateur...");
      const userRes = await AuthService.register({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email as string,
        password: data.password as string,
        role: "elv",
      });
      const userId = (userRes as any).user?.id || (userRes as any).id;
      
      console.log("Phase 2: Profil élève...");
      const studentRes = await StudentService.create({
        userId,
        matricule: data.matricule,
        sexe: data.sexe,
        dateNaissance: data.dateNaissance || undefined,
        lieuNaissance: data.lieuNaissance,
        nationalite: data.nationalite,
        photoUrl: finalPhotoUrl || undefined,
      });

      console.log("Phase 3: Inscription classe...");
      const anneeId = config?.anneeActiveId;
      if (!anneeId) throw new Error("Année scolaire active non configurée");

      await InscriptionService.create({
        eleveId: studentRes.id,
        classeId: parseInt((data.classeId || "0") as string),
        anneeId,
        statut: "ins"
      });

      queryClient.invalidateQueries({ queryKey: ["eleves"] });
      onOpenChange(false);
      reset();
      setSelectedFile(null);
      setLocalPreview(null);
      toast.success("Élève inscrit avec succès !");
    } catch (err: any) {
      console.error(" Échec:", err.response?.data || err.message);
      toast.error(`Erreur d'inscription: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nouvelle Inscription</SheetTitle>
          <SheetDescription>
            Créez un compte élève et inscrivez-le dans une classe.
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
            <AccountSection />
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
                    En cours...
                  </>
                ) : (
                  "Valider l'inscription"
                )}
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}


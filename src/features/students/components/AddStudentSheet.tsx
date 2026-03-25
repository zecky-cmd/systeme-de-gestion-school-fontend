"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AuthService } from "@/services/auth.service";
import { StudentService } from "@/services/student.service";
import { ClasseService } from "@/services/classe.service";
import { InscriptionService } from "@/services/inscription.service";
import { ConfigService } from "@/services/config.service";
import { StorageService } from "@/services/storage.service";
import { Loader2, PlusIcon, XIcon } from "lucide-react";

const studentSchema = z.object({

  // User info
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  
  // Student profile
  matricule: z.string().optional(),
  sexe: z.enum(["M", "F"]),
  dateNaissance: z.string().optional().or(z.literal("")),
  lieuNaissance: z.string().optional(),
  nationalite: z.string().optional(),
  
  // Registration
  classeId: z.string().min(1, "La classe est requise"),
  
  // social/profile
  photoUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface AddStudentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStudentSheet({ open, onOpenChange }: AddStudentSheetProps) {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les classes
  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: ClasseService.getAll,
    enabled: open,
  });

  // Charger la config pour l'année active
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: ConfigService.getConfig,
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      sexe: "M",
      password: "Education2026!", // Mot de passe par défaut
      nationalite: "Ivoirienne",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setLocalPreview(url);
      // On vide le champ URL si on utilise un fichier local
      setValue("photoUrl", "");
    }
  };

  const onSubmit = async (data: StudentFormValues) => {
    try {
      console.log("🚀 Lancement du flux d'inscription complet...");

      let finalPhotoUrl = data.photoUrl;

      // SI on a un fichier local, on l'uploade vers Supabase
      if (selectedFile) {
        console.log("Phase 0: Upload de la photo vers Supabase...");
        finalPhotoUrl = await StorageService.uploadProfilePhoto(selectedFile);
        console.log("Lien photo généré:", finalPhotoUrl);
      }

      // 1. Créer le compte Utilisateur
      console.log("Phase 1: Création du compte utilisateur...");
      const userRes = await AuthService.register({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
        role: "elv",
      });
      const userId = (userRes as any).user?.id || (userRes as any).id;
      
      if (!userId) throw new Error("Impossible de récupérer l'ID de l'utilisateur créé");

      // 2. Créer le profil Élève
      console.log(`Phase 2: Création du profil élève pour l'utilisateur ${userId}...`);
      const studentRes = await StudentService.create({
        userId: userId,
        matricule: data.matricule,
        sexe: data.sexe,
        dateNaissance: data.dateNaissance || undefined,
        lieuNaissance: data.lieuNaissance,
        nationalite: data.nationalite,
        photoUrl: finalPhotoUrl || undefined,
      });
      const eleveId = studentRes.id;

      // 3. Inscription dans la classe
      const anneeId = config?.anneeActiveId;
      if (!anneeId) throw new Error("Année scolaire active non configurée");

      console.log(`Phase 3: Inscription de l'élève ${eleveId} dans la classe ${data.classeId}...`);
      await InscriptionService.create({
        eleveId,
        classeId: parseInt(data.classeId as string),
        anneeId,
        statut: "ins"
      });

      console.log("✅ Inscription terminée avec succès !");
      
      queryClient.invalidateQueries({ queryKey: ["eleves"] });
      onOpenChange(false);
      reset();
      setSelectedFile(null);
      setLocalPreview(null);
      alert("Élève inscrit avec succès !");

    } catch (err: any) {
      console.error("❌ Échec de l'inscription:", err.response?.data || err.message);
      alert(`Erreur d'inscription: ${err.response?.data?.message || err.message}`);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-4 py-6">
          {/* Section Photo de Profil Preview */}
          <div className="flex flex-col items-center justify-center pb-6 space-y-4">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-full border-4 border-emerald-100 dark:border-emerald-900/30 overflow-hidden bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center transition-all group-hover:border-emerald-500 shadow-sm">
                {(localPreview || watch("photoUrl")) ? (
                  <img 
                    src={localPreview || watch("photoUrl")} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${watch("nom") || "User"}`;
                    }}
                  />
                ) : (
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${watch("nom") || "User"}`} 
                    alt="Initials" 
                    className="w-16 h-16 opacity-50"
                  />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-950 shadow-lg transform translate-x-1 translate-y-1 group-hover:scale-110 transition-transform">
                <PlusIcon className="h-3 w-3" />
              </div>
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] text-white font-bold uppercase tracking-tight">Changer</span>
              </div>
              
              {(localPreview || watch("photoUrl")) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setLocalPreview(null);
                    setValue("photoUrl", "");
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-950 shadow-md hover:bg-red-600 transition-colors z-10"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="w-full space-y-2 text-center">
              <Label htmlFor="photoUrl" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ou coller l'URL d'une image</Label>
              <Input 
                id="photoUrl" 
                {...register("photoUrl")} 
                placeholder="https://..."
                className="h-7 text-[11px] bg-slate-50 dark:bg-slate-900/40 border-dashed text-center"
              />
              {errors.photoUrl && <p className="text-[10px] text-red-500">{errors.photoUrl.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b pb-1">Infos Personnelles</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" {...register("nom")} placeholder="KOUASSI" />
                {errors.nom && <p className="text-[10px] text-red-500">{errors.nom.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" {...register("prenom")} placeholder="Jean" />
                {errors.prenom && <p className="text-[10px] text-red-500">{errors.prenom.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sexe</Label>
                <Select 
                  value={watch("sexe")} 
                  onValueChange={(val: string | null) => {
                    if (val === "M" || val === "F") {
                      setValue("sexe", val);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sexe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="matricule">Matricule</Label>
                <Input id="matricule" {...register("matricule")} placeholder="Ex: 24-001" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b pb-1">Compte & Accès</h3>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="jean.k@email.com" />
              {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe provisoire</Label>
              <Input id="password" type="text" {...register("password")} />
              {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b pb-1">Scolarité</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classeId">Classe d'affectation</Label>
                <Select onValueChange={(val: string | null) => {
                  if (typeof val === "string") {
                    setValue("classeId", val);
                  }
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.classeId && <p className="text-[10px] text-red-500">{errors.classeId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateNaissance">D. Naissance</Label>
                <Input id="dateNaissance" type="date" {...register("dateNaissance")} />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label htmlFor="lieuNaissance">Lieu de naissance & Nationalité</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input id="lieuNaissance" {...register("lieuNaissance")} placeholder="Abidjan" />
              <Input id="nationalite" {...register("nationalite")} placeholder="Ivoirienne" />
            </div>
          </div>

          <SheetFooter className="pt-6 pb-2">
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base font-bold shadow-md shadow-emerald-500/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "Valider l'inscription"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

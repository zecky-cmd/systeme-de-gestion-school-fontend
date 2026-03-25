"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { canPerform, UserRole } from "@/constants/permissions";

import { ActionToolbar } from "@/components/shared/ActionToolbar";

import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,  
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

import { StudentService, type Eleve } from "@/services/student.service";
import { AddStudentSheet } from "@/features/students/components/AddStudentSheet";

import { useAuthStore } from "@/store/authStore";

export default function GestionElevesPage() {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const { hasHydrated, user } = useAuthStore();


  const { data: eleves, isLoading, error } = useQuery({
    queryKey: ['eleves'],
    queryFn: StudentService.getAll,
    enabled: hasHydrated,
  });

  if (!hasHydrated) return <TableSkeleton columns={7} rows={6} />;


  if (error) {
    const isForbidden = (error as any).response?.status === 403;
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400">
        <p className="font-bold text-lg mb-2">Erreur de chargement {isForbidden ? "(Accès Refusé)" : ""}</p>
        <p className="text-sm mb-4">
          {isForbidden 
            ? `Désolé, votre rôle "${user?.role}" ne vous permet pas de voir la liste complète des élèves.` 
            : ((error as any).response?.data?.message || (error as Error).message)}
        </p>
        <div className="flex justify-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="border-red-200 hover:bg-red-100"
          >
            Réessayer
          </Button>
          {isForbidden && (
            <Button 
              variant="default"
              onClick={() => {
                useAuthStore.getState().logout();
                window.location.href = "/login";
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Changer de compte
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <RoleGuard>
      <div className="space-y-6">
        <PageHeader 
          title="Gestion des élèves" 
          subtitle="Année scolaire 2025-2026"
          showExport={true}
          actionButton={canPerform(user?.role as UserRole, 'CREATE_STUDENT') ? {
            label: "Nouvelle inscription",
            onClick: () => setIsAddSheetOpen(true)
          } : undefined}
        />



        <ActionToolbar 
          searchPlaceholder="Rechercher par nom, matricule..."
          filters={[
            {
              key: "classe",
              placeholder: "Classe",
              options: [
                { value: "tle-d", label: "Terminale D" },
                { value: "3eme-b", label: "3eme B" },
              ]
            },
            {
              key: "statut",
              placeholder: "Statut",
              options: [
                { value: "tous", label: "Tous" },
                { value: "inscrit", label: "Inscrit" },
                { value: "pre-inscrit", label: "Pre-inscrit" },
                { value: "transfert", label: "Transfert" },
              ]
            }
          ]}
        />

        {isLoading ? (
          <TableSkeleton columns={7} rows={6} />
        ) : (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[150px] font-semibold">MATRICULE</TableHead>
                    <TableHead className="font-semibold">NOM & PRENOM</TableHead>
                    <TableHead className="font-semibold">CLASSE</TableHead>
                    <TableHead className="font-semibold">SEXE</TableHead>
                    <TableHead className="font-semibold">STATUT</TableHead>
                    <TableHead className="font-semibold">PAIEMENT</TableHead>
                    <TableHead className="text-right font-semibold">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eleves?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                        Aucun élève trouvé.
                      </TableCell>
                    </TableRow>
                  ) : (
                    eleves?.map((eleve: any) => {
                      // Mapping flexible si les donnees viennent de User ou Eleve
                      const nom = eleve.nom || eleve.user?.nom || "Non renseigné";
                      const prenom = eleve.prenom || eleve.user?.prenom || "";
                      const fullNom = `${nom} ${prenom}`;
                      const initials = nom.substring(0,1) + (prenom.substring(0,1) || "");
                      const classeName = eleve.classe?.nom || eleve.currentClasse || "N/A";
                      const photoUrl = eleve.photoUrl || eleve.user?.photoUrl;

                      return (
                        <TableRow key={eleve.id} className="hover:bg-muted/50 transition-colors group">
                          <TableCell className="font-medium text-muted-foreground">{eleve.matricule}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800/50 overflow-hidden shadow-sm transition-transform group-hover:scale-110">
                                {photoUrl ? (
                                  <img 
                                    src={photoUrl} 
                                    alt={fullNom} 
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                      (e.target as HTMLImageElement).parentElement!.innerHTML = initials;
                                    }}
                                  />
                                ) : (
                                  initials
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 dark:text-slate-100 uppercase text-[13px] tracking-tight">{nom}</span>
                                <span className="text-[11px] text-slate-500 font-medium">{prenom}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>{classeName}</TableCell>
                          <TableCell>{eleve.sexe}</TableCell>
                          <TableCell>
                            <StatusBadge status={eleve.statut || "Inscrit"} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={eleve.paiement || "Complet"} variant="payment" />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-4 border-t border-border flex items-center justify-between text-sm">
              <div className="text-muted-foreground">Affichage de {eleves?.length || 0} eleves</div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Precedent</Button>
                <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">1</Button>
                <Button variant="outline" size="sm">Suivant</Button>
              </div>
            </div>
          </div>
        )}

        <AddStudentSheet 
          open={isAddSheetOpen} 
          onOpenChange={setIsAddSheetOpen} 
        />

      </div>
    </RoleGuard>
  );
}


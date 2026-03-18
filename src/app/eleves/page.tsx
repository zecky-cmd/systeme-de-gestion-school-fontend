"use client";

import { PageHeader } from "@/components/shared/PageHeader";
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

const mockEleves = [
  { id: 1, matricule: "EDU-2025-0001", nom: "Kouame Aya Marie", initials: "KA", classe: "Terminale D", sexe: "F", statut: "Inscrit", paiement: "Complet" },
  { id: 2, matricule: "EDU-2025-0002", nom: "Traore Moussa", initials: "TM", classe: "3eme B", sexe: "M", statut: "Pre-inscrit", paiement: "Partiel" },
  { id: 3, matricule: "EDU-2025-0003", nom: "Bamba Fatou", initials: "BF", classe: "2nde C", sexe: "F", statut: "Inscrit", paiement: "Complet" },
  { id: 4, matricule: "EDU-2025-0004", nom: "Diallo Ibrahim", initials: "DI", classe: "6eme A", sexe: "M", statut: "Inscrit", paiement: "En retard" },
  { id: 5, matricule: "EDU-2025-0005", nom: "Koffi Jean-Pierre", initials: "KJ", classe: "Terminale A2", sexe: "M", statut: "Pre-inscrit", paiement: "Non paye" },
  { id: 6, matricule: "EDU-2025-0006", nom: "Coulibaly Aminata", initials: "CA", classe: "5eme C", sexe: "F", statut: "Inscrit", paiement: "Complet" },
];

// Simulation de l'appel API (a remplacer par fetch/axios vers NestJS plus tard)
const fetchEleves = async () => {
  return new Promise<typeof mockEleves>((resolve) => {
    setTimeout(() => {
      resolve(mockEleves);
    }, 2000); // Delai de 2 secondes pour bien voir le Skeleton
  });
};

export default function GestionElevesPage() {
  const { data: eleves, isLoading } = useQuery({
    queryKey: ['eleves'],
    queryFn: fetchEleves,
  });
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des eleves" 
        subtitle="Annee scolaire 2025-2026"
        showExport={true}
        actionButton={{
          label: "Nouvelle inscription",
          onClick: () => console.log("Nouvelle inscription cliquée")
        }}
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
                {eleves?.map((eleve) => (
                  <TableRow key={eleve.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-muted-foreground">{eleve.matricule}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium text-xs">
                          {eleve.initials}
                        </div>
                        <span className="font-medium">{eleve.nom}</span>
                      </div>
                    </TableCell>
                    <TableCell>{eleve.classe}</TableCell>
                    <TableCell>{eleve.sexe}</TableCell>
                    <TableCell>
                      <StatusBadge status={eleve.statut} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={eleve.paiement} variant="payment" />
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
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination simple factice */}
          <div className="p-4 border-t border-border flex items-center justify-between text-sm">
            <div className="text-muted-foreground">Affichage de 1 a 6 sur 1 247 eleves</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Precedent</Button>
              <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Suivant</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

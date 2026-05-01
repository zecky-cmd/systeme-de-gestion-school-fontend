"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2 
} from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { ActionToolbar } from "@/components/shared/ActionToolbar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RoleGuard } from "@/components/auth/RoleGuard";

import { StudentService, type Eleve } from "@/services/student.service";
import { AddStudentSheet } from "@/features/students/components/AddStudentSheet";
import { StudentDetailSheet } from "@/features/students/components/StudentDetailSheet";
import { EditStudentSheet } from "@/features/students/components/EditStudentSheet";

import { useAuthStore } from "@/store/authStore";

export default function GestionElevesPage() {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false); // NEW
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false); // NEW
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // NEW
  const { hasHydrated, user } = useAuthStore();
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const { data: eleves, isLoading, error } = useQuery({
    queryKey: ['eleves'],
    queryFn: StudentService.getAll,
    enabled: hasHydrated,
  });

  if (!hasHydrated) return <TableSkeleton columns={7} rows={6} />;

  // Handlers (NEW)
  const handleView = (student: any) => {
    setSelectedStudent(student);
    setIsViewSheetOpen(true);
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setIsEditSheetOpen(true);
  };

  // LOGIQUE DE FILTRAGE LOCAL
  const filteredEleves = eleves?.filter((eleve: any) => {
    // 1. Filtrage par texte (nom, prenom, matricule)
    const searchLower = searchTerm.toLowerCase();
    const nom = (eleve.nom || eleve.user?.nom || "").toLowerCase();
    const prenom = (eleve.prenom || eleve.user?.prenom || "").toLowerCase();
    const matricule = (eleve.matricule || "").toLowerCase();
    
    const matchesSearch = !searchTerm || 
      nom.includes(searchLower) || 
      prenom.includes(searchLower) || 
      matricule.includes(searchLower);

    // 2. Filtrage par classe
    const matchesClasse = !selectedClasse || 
      eleve.classe?.id?.toString() === selectedClasse ||
      eleve.classe?.nom?.toLowerCase().includes(selectedClasse.toLowerCase());

    // 3. Filtrage par statut (Si applicable)
    // Note: On adapte selon les data réelles
    const matchesStatus = !selectedStatus || 
      (selectedStatus === "tous" ? true : eleve.statut?.toLowerCase() === selectedStatus.toLowerCase());

    return matchesSearch && matchesClasse && matchesStatus;
  });

  if (error) {
    const isForbidden = (error as any).response?.status === 403;
    if (isForbidden) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] p-8 text-center bg-card rounded-2xl border border-dashed">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="text-red-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Accès Non Autorisé</h2>
          <p className="text-muted-foreground max-w-md">
            Désolé, vous n'avez pas les permissions nécessaires pour consulter la liste des élèves. 
            Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur.
          </p>
        </div>
      );
    }
    return <div className="p-8 text-center text-red-500">Erreur lors du chargement des données.</div>;
  }

  // Vérifier les permissions pour les boutons d'action (NEW)
  const canAdd = user?.role === "adm" || user?.role === "dir";

  return (
    <RoleGuard allowedRoles={["adm", "dir", "ens"]}> {/* Modified RoleGuard */}
      <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500"> {/* Modified structure */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4"> {/* Modified structure */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Gestion des <span className="text-emerald-600">Élèves</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Consultez, ajoutez et gérez les fiches des élèves de l'établissement.
            </p>
          </div>
          
          {canAdd && (
            <Button 
              onClick={() => setIsAddSheetOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all active:scale-95 h-11 px-6 rounded-xl font-bold flex items-center gap-2"
            >
              <Plus size={20} />
              Nouvelle inscription
            </Button>
          )}
        </header>

        <ActionToolbar 
          searchPlaceholder="Rechercher par nom, matricule..."
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1); // Reset page on search
          }}
          onFilterChange={(key: string, val: string) => {
            if (key === "classe") setSelectedClasse(val);
            if (key === "statut") setSelectedStatus(val);
            setCurrentPage(1); // Reset page on filter
          }}
          filters={[
            {
              key: "classe",
              placeholder: "Toutes les classes",
              options: [
                { value: "tle-d", label: "Terminale D" },
                { value: "3eme-b", label: "3eme B" },
              ]
            },
            {
              key: "statut",
              placeholder: "Tout statut",
              options: [
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
                  {filteredEleves?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                        Aucun élève trouvé.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (() => {
                      const totalItems = filteredEleves?.length || 0;
                      const totalPages = Math.ceil(totalItems / itemsPerPage);
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const paginatedEleves = filteredEleves?.slice(startIndex, startIndex + itemsPerPage);

                      return paginatedEleves?.map((eleve: any) => {

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
                              <Button 
                                onClick={() => handleView(eleve)} // Updated onClick
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                onClick={() => handleEdit(eleve)} // Updated onClick
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="h-4 w-4" /> {/* Changed from Edit to Pencil */}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })()
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-4 border-t border-border flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                Affichage de {filteredEleves?.length ? Math.min((currentPage - 1) * itemsPerPage + 1, filteredEleves.length) : 0} à {Math.min(currentPage * itemsPerPage, filteredEleves?.length || 0)} sur {filteredEleves?.length || 0} élèves
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || !filteredEleves?.length}
                >
                  Précédent
                </Button>
                
                <div className="flex items-center gap-1 px-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Page {currentPage} sur {Math.max(1, Math.ceil((filteredEleves?.length || 0) / itemsPerPage))}</span>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!filteredEleves || currentPage >= Math.ceil(filteredEleves.length / itemsPerPage)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        )}

        <AddStudentSheet 
          open={isAddSheetOpen} 
          onOpenChange={setIsAddSheetOpen} 
        />

        <StudentDetailSheet
          student={selectedStudent}
          open={isViewSheetOpen}
          onOpenChange={setIsViewSheetOpen}
          onEdit={(student) => {
            setIsViewSheetOpen(false);
            setIsEditSheetOpen(true);
            setSelectedStudent(student);
          }}
        />

        <EditStudentSheet
          student={selectedStudent}
          open={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
        />
      </div>
    </RoleGuard>
  );
}


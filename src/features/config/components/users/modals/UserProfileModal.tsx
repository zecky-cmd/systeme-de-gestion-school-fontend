import React from "react";
import { 
  Dialog, 
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  GraduationCap, 
  Users as UsersIcon, 
  Baby, 
  Clock,
  Calendar,
  X,
  Check
} from "lucide-react";
import { ConfigUser } from "@/services/user-management.service";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ConfigUser | null;
  isLoading?: boolean;
}

export function UserProfileModal({ isOpen, onClose, user, isLoading = false }: UserProfileModalProps) {
  const getRoleInfo = (role?: string) => {
    switch (role) {
      case "adm": return { label: "Administrateur", icon: Shield };
      case "dir": return { label: "Directeur", icon: UserIcon };
      case "ens": return { label: "Enseignant", icon: GraduationCap };
      case "par": return { label: "Parent", icon: Baby };
      case "elv": return { label: "Élève", icon: UsersIcon };
      default: return { label: role || "", icon: UserIcon };
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Aucune connexion enregistrée";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Format invalide";
    
    const day = date.toLocaleDateString("fr-FR", { day: "numeric" });
    const month = date.toLocaleDateString("fr-FR", { month: "long" });
    const year = date.toLocaleDateString("fr-FR", { year: "numeric" });
    const time = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    
    return `${day} ${month} ${year} à ${time}`;
  };

  const roleInfo = getRoleInfo(user?.role);
  const RoleIcon = roleInfo.icon;
  const initials = user ? `${user.nom?.[0] || ""}${user.prenom?.[0] || ""}`.toUpperCase() : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        showCloseButton={false}
        className="max-w-md bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden"
      >
        {/* Banner de Couleur de Marque (Mockup Dynamisé) */}
        <div className="h-28 bg-primary relative flex items-center px-6">
          <h2 className="text-white text-lg font-bold font-heading">
            Détails de l'utilisateur
          </h2>
          
          {/* Bouton Fermer Blanc Mockup */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Avatar Rond ID à cheval */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
              <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-white border border-white font-bold text-2xl overflow-hidden">
                {isLoading ? (
                  <Skeleton className="h-full w-full rounded-full bg-primary/30" />
                ) : user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span>{initials || "ID"}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Détails du profil */}
        <div className="pt-16 px-6 pb-8 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-2 mt-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ) : (
            user && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#1f2937] font-heading">
                  {user.prenom} {user.nom}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {user.email}
                </p>
                
                {/* Badges verts stylisés mockup utilisant les variables du site */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1 flex items-center gap-1.5 text-xs font-semibold shadow-none">
                    <RoleIcon size={13} className="text-primary" />
                    {roleInfo.label}
                  </Badge>
                  {user.estActif !== false ? (
                    <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1 flex items-center gap-1.5 text-xs font-semibold shadow-none">
                      <Check size={13} className="text-primary" />
                      Actif
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-3.5 py-1 flex items-center gap-1.5 text-xs font-semibold shadow-none">
                      <X size={13} className="text-rose-700" />
                      Inactif
                    </Badge>
                  )}
                </div>
              </div>
            )
          )}

          <hr className="border-slate-100" />

          {/* Grille d'informations (Mockup - Hors champ ID) */}
          <div className="space-y-5">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              ))
            ) : (
              user && (
                <>
                  {/* ADRESSE EMAIL */}
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Adresse Email</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5 break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* DERNIÈRE CONNEXION */}
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Clock size={18} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dernière Connexion</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {formatDate(user.derniereConnexion)}
                      </p>
                    </div>
                  </div>

                  {/* DATE DE CRÉATION */}
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date de création</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* DERNIÈRE MISE À JOUR */}
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dernière mise à jour</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {formatDate(user.updatedAt)}
                      </p>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

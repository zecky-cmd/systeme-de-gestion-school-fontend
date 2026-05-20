import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfigUser } from "@/services/user-management.service";
import { UserProfileHeader } from "./UserProfileHeader";
import { UserProfileInfo } from "./UserProfileInfo";
import { UserProfileDetails } from "./UserProfileDetails";
import { UserProfileSkeleton } from "./UserProfileSkeleton";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ConfigUser | null;
  isLoading?: boolean;
}

/**
 * Orchestrateur Principal du Modal de Fiche Profil Utilisateur.
 * Délègue chaque section à son sous-composant dédié pour un code lisible et modulaire.
 */
export function UserProfileModal({ isOpen, onClose, user, isLoading = false }: UserProfileModalProps) {
  const initials = user ? `${user.nom?.[0] || ""}${user.prenom?.[0] || ""}`.toUpperCase() : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden"
      >
        {/* En-tête : Bannière verte et avatar à cheval */}
        <UserProfileHeader
          user={user}
          isLoading={isLoading}
          onClose={onClose}
          initials={initials}
        />

        {/* Corps du modal */}
        <div className="pt-16 px-6 pb-8">
          {isLoading ? (
            <UserProfileSkeleton />
          ) : (
            user && (
              <div className="space-y-6">
                {/* Section centrale : Nom, Email et Badges */}
                <UserProfileInfo user={user} />

                <hr className="border-slate-100" />

                {/* Grille d'informations : Détails de connexion et création */}
                <UserProfileDetails user={user} />
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

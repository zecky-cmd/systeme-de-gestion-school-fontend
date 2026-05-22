import type { UserRole } from "@/constants/permissions";
import { USER_ROLE_LABELS } from "../constants";

export interface UserDisplaySource {
  nom: string;
  prenom: string;
  email?: string;
  role?: UserRole;
  photoUrl?: string;
}

export interface UserDisplayInfo {
  initials: string;
  fullName: string;
  email: string;
  roleLabel: string;
  photoUrl?: string;
}

export function getUserDisplayInfo(
  user: UserDisplaySource | null | undefined
): UserDisplayInfo {
  if (!user) {
    return {
      initials: "AD",
      fullName: "Utilisateur",
      email: "utilisateur@edumanager.ci",
      roleLabel: "Invité",
    };
  }

  return {
    initials: `${user.nom.substring(0, 1)}${user.prenom.substring(0, 1)}`,
    fullName: `${user.nom} ${user.prenom}`,
    email: user.email ?? "utilisateur@edumanager.ci",
    roleLabel: user.role ? USER_ROLE_LABELS[user.role] : "Utilisateur",
    photoUrl: user.photoUrl,
  };
}

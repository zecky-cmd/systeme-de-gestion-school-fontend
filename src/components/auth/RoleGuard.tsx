"use client";

import { useAuthStore } from "@/store/authStore";
import { UserRole, canAccess } from "@/constants/permissions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[]; // Si fourni, surcharge la config globale pour ce composant
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, hasHydrated, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      const role = user?.role as UserRole;
      const isAuthorized = allowedRoles 
        ? allowedRoles.includes(role)
        : canAccess(role, pathname);

      if (!isAuthorized) {
        // Rediriger vers le dashboard si non autorisé
        router.push("/");
      }
    }
  }, [hasHydrated, isAuthenticated, user, pathname, router, allowedRoles]);

  if (!hasHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const role = user?.role as UserRole;
  const isAuthorized = allowedRoles 
    ? allowedRoles.includes(role)
    : canAccess(role, pathname);

  if (!isAuthenticated || !isAuthorized) {
    return null; // Le useEffect gère la redirection
  }

  return <>{children}</>;
}

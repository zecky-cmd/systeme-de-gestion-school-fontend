"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { UserRole, canAccess } from "@/constants/permissions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasHydrated, user } = useAuthStore();

  useEffect(() => {
    if (hasHydrated) {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }

      // Vérification des droits d'accès pour l'URL actuelle
      const role = user?.role as UserRole;
      if (!canAccess(role, pathname)) {
        router.replace("/");
      }
    }
  }, [hasHydrated, isAuthenticated, user, pathname, router]);

  // Pendant l'hydratation, on peut afficher un état de chargement global
  if (!hasHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-emerald-600 font-medium animate-pulse">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // On sera redirigé par le useEffect
  }

  // Empêcher l'affichage de la page si l'utilisateur n'a pas les droits requis
  const role = user?.role as UserRole;
  const isAuthorized = canAccess(role, pathname);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-emerald-600 font-medium animate-pulse">Vérification de vos droits...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className="print:block">
      <div className="print:hidden">
        <AppSidebar />
      </div>
      <main className="flex-1 overflow-x-hidden bg-slate-100/50 dark:bg-background text-foreground flex flex-col min-h-screen print:bg-white print:p-0">
        <div className="print:hidden">
          <DashboardHeader />
        </div>
        <div className="flex-1 p-6 md:p-8 print:p-0">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}



"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Pendant l'hydratation ou si non authentifié, on peut afficher un état de chargement global
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-x-hidden bg-background text-foreground flex flex-col min-h-screen">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2" />
          </div>
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}


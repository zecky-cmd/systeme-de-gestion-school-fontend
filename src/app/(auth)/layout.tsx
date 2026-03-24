"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/");
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Si on est déjà connecté, on n'affiche rien du tout pendant la redirection
  if (hasHydrated && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

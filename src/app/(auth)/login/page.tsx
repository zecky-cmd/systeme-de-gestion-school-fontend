import { LoginSidebar } from "@/features/auth/components/LoginSidebar";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* Coté Gauche - Branding & Stats */}
      <LoginSidebar />

      {/* Coté Droit - Formulaire de Connexion */}
      <LoginForm />
    </div>
  );
}

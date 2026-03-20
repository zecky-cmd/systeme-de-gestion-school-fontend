import { LoginSidebar } from "@/features/auth/components/LoginSidebar";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* Coté Gauche - Branding & Stats (Réutilisation) */}
      <LoginSidebar />

      {/* Coté Droit - Formulaire Mot de passe oublié */}
      <ForgotPasswordForm />
    </div>
  );
}

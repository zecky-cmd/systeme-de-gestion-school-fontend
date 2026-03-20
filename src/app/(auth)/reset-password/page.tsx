import { LoginSidebar } from "@/features/auth/components/LoginSidebar";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* Coté Gauche - Branding & Stats */}
      <LoginSidebar />

      {/* Coté Droit - Formulaire Réinitialisation */}
      <ResetPasswordForm />
    </div>
  );
}

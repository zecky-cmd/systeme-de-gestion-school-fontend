"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  BookMarked, 
  Mail, 
  ArrowLeft,
  Send
} from "lucide-react";
import Link from "next/link";

import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../types";
import { AuthContainer } from "./shared/AuthContainer";
import { AuthCard } from "./shared/AuthCard";
import { AuthHeader } from "./shared/AuthHeader";
import { AuthField } from "./shared/AuthField";
import { AuthButton } from "./shared/AuthButton";

import { AuthService } from "@/services/auth.service";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.forgotPassword(data.email);
      // On redirige vers la page de réinitialisation après envoi
      window.location.href = "/reset-password";
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        "Une erreur est survenue. Veuillez vérifier votre email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader 
          icon={BookMarked}
          title="Mot de passe oublié"
          description="Entrez l'adresse email associée à votre compte pour recevoir un code de réinitialisation."
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <AuthField
            id="email"
            label="Adresse email"
            type="email"
            placeholder="votreemail@etablissement.ci"
            icon={Mail}
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthButton isLoading={isLoading} loadingText="Envoi en cours..." icon={Send}>
            Envoyer le lien
          </AuthButton>
        </form>

        <div className="mt-8 text-center">
          <Link 
            href="/login" 
            className="text-sm font-semibold text-slate-500 hover:text-emerald-600 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour à la connexion
          </Link>
        </div>
      </AuthCard>
    </AuthContainer>
  );
}

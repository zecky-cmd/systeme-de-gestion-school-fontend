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

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

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
    console.log("Forgot password for:", data.email);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/reset-password";
    }, 1500);
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader 
          icon={BookMarked}
          title="Mot de passe oublié"
          description="Entrez l'adresse email associée à votre compte pour recevoir un lien de réinitialisation."
        />

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

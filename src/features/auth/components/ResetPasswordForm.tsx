"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Lock, 
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Timer
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../types";
import { AuthContainer } from "./shared/AuthContainer";
import { AuthCard } from "./shared/AuthCard";
import { AuthHeader } from "./shared/AuthHeader";
import { AuthField } from "./shared/AuthField";
import { AuthButton } from "./shared/AuthButton";

import { AuthService } from "@/services/auth.service";

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.resetPassword({
        code: data.code,
        newPassword: data.newPassword
      });
      window.location.href = "/login?reset=success";
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        "Code invalide ou expiré. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader 
          icon={ShieldCheck}
          title="Réinitialisation"
          description="Saisissez le code de 6 chiffres reçu par email et votre nouveau mot de passe."
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <AuthField
            id="code"
            label="Code de vérification"
            placeholder="Ex: 545827"
            maxLength={6}
            className="text-center text-xl font-bold tracking-[0.5em]"
            error={errors.code?.message}
            {...register("code")}
            labelRightElement={
              <div className={cn(
                "flex items-center gap-1.5 text-xs font-bold",
                timeLeft > 10 ? "text-emerald-600" : "text-red-500 animate-pulse"
              )}>
                <Timer size={14} />
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </div>
            }
          />

          <AuthField
            id="newPassword"
            label="Nouveau mot de passe"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 6 caractères"
            icon={Lock}
            error={errors.newPassword?.message}
            {...register("newPassword")}
            inputRightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <AuthButton isLoading={isLoading} loadingText="Réinitialisation..." disabled={timeLeft === 0}>
            Changer mon mot de passe
          </AuthButton>
        </form>

        <div className="mt-8 text-center flex flex-col gap-4">
          {timeLeft === 0 && (
            <button type="button" className="text-xs text-emerald-600 font-bold hover:underline">
              Renvoyer un code
            </button>
          )}
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

"use client";

import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  BookMarked, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight
} from "lucide-react";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFormValues, type User } from "../types";
import { AuthContainer } from "./shared/AuthContainer";
import { AuthCard } from "./shared/AuthCard";
import { AuthHeader } from "./shared/AuthHeader";
import { AuthField } from "./shared/AuthField";
import { AuthButton } from "./shared/AuthButton";

import { useAuthStore } from "@/store/authStore";
import { AuthService } from "@/services/auth.service";

import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({
        email: data.email,
        password: data.password,
      });

      if (!response.accessToken || !response.user) {
        throw new Error("Impossible de récupérer les informations de session.");
      }

      // Stocker la session dans Zustand
      setAuth(response.accessToken as string, response.user as User);
      
      // Redirection fluide
      router.push("/");
      router.refresh();

    } catch (err: any) {
      console.error("Login error detail:", err);
      const message = err.response?.data?.message || 
                     err.message || 
                     "Identifiants invalides ou erreur serveur.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Identifiants démo pré-définis
      const demoEmail = "admin@demo.com";
      const demoPassword = "password123";

      const response = await AuthService.login({
        email: demoEmail,
        password: demoPassword,
      });

      if (!response.accessToken || !response.user) {
        throw new Error("Impossible de récupérer les informations de session démo.");
      }

      setAuth(response.accessToken as string, response.user as User);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError("Accès Démo temporairement indisponible.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader 
          icon={BookMarked}
          title="Connexion"
          description="Entrez vos identifiants pour accéder à votre espace"
        />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <AuthField
            id="email"
            label="Adresse email"
            type="email"
            placeholder="nom@etablissement.ci"
            icon={Mail}
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthField
            id="password"
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            placeholder="Votre mot de passe"
            icon={Lock}
            error={errors.password?.message}
            {...register("password")}
            labelRightElement={
              <Link 
                href="/forgot-password" 
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            }
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

          <div className="flex items-center space-x-2 pt-1">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  id="remember" 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="rounded-md border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-none" 
                />
              )}
            />
            <label
              htmlFor="remember"
              className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-none cursor-pointer"
            >
              Se souvenir de moi
            </label>
          </div>

          <AuthButton isLoading={isLoading} icon={ArrowRight}>
            Se connecter
          </AuthButton>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl flex items-center justify-between gap-4">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Vous êtes recruteur ?</p>
                <p className="text-xs text-slate-500 font-medium italic">Accédez au dashboard en un clic.</p>
             </div>
             <button 
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
             >
                {isLoading ? "CHARGEMENT..." : "ACCÈS DÉMO"}
             </button>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Portail parents ? <Link href="/portal" className="text-emerald-600 font-bold hover:underline">Accédez ici</Link>
          </p>
        </div>

      </AuthCard>

      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-600 font-medium tracking-wide">
          EduManager CI v1.0 — Collège & Lycée
        </p>
      </div>
    </AuthContainer>
  );
}

"use client";

import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { 
  BookMarked, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginFormValues } from "../types";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
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
    console.log("Login data:", data);
    // Simulation
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-slate-50 dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo mobile */}
        <div className="lg:hidden flex justify-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
            <BookMarked className="h-8 w-8" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Connexion</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm px-6">
              Entrez vos identifiants pour accéder à votre espace
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Adresse email
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={16} />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@etablissement.ci"
                  className={cn(
                    "pl-10 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-emerald-500/20",
                    errors.email && "border-red-500 focus:ring-red-500/10"
                  )}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium ml-1 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mot de passe
                </Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={16} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  className={cn(
                    "pl-10 pr-10 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-emerald-500/20",
                    errors.password && "border-red-500 focus:ring-red-500/10"
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium ml-1 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/20 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Chargement...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Se connecter</span>
                  <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Portail parents ? <Link href="/portal" className="text-emerald-600 font-bold hover:underline">Accédez ici</Link>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-600 font-medium tracking-wide">
            EduManager CI v1.0 — Collège & Lycée
          </p>
        </div>
      </motion.div>
    </div>
  );
}

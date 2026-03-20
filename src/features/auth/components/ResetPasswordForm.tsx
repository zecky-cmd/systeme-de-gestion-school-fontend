"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { 
  BookMarked, 
  Lock, 
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Timer
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../types";

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute

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
    console.log("Reset password with code:", data.code);
    // Simulation
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/login?reset=success";
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="text-center space-y-2 mb-10">
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                <ShieldCheck size={28} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Réinitialisation</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm px-4 leading-relaxed">
              Saisissez le code de 6 chiffres reçu par email et votre nouveau mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="code" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Code de vérification
                </Label>
                <div className={cn(
                  "flex items-center gap-1.5 text-xs font-bold",
                  timeLeft > 10 ? "text-emerald-600" : "text-red-500 animate-pulse"
                )}>
                  <Timer size={14} />
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
              </div>
              <Input
                id="code"
                placeholder="Ex: 545827"
                maxLength={6}
                className={cn(
                  "h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-emerald-500/20 text-center text-xl font-bold tracking-[0.5em]",
                  errors.code && "border-red-500 focus:ring-red-500/10"
                )}
                {...register("code")}
              />
              {errors.code && (
                <p className="text-xs text-red-500 font-medium ml-1 mt-1 text-center">
                  {errors.code.message}
                </p>
              )}
              {timeLeft === 0 && (
                <button type="button" className="w-full text-xs text-emerald-600 font-bold hover:underline mt-2">
                  Renvoyer un code
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Nouveau mot de passe
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={16} />
                </div>
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 caractères"
                  className={cn(
                    "pl-10 pr-10 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-emerald-500/20",
                    errors.newPassword && "border-red-500 focus:ring-red-500/10"
                  )}
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-500 font-medium ml-1 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || timeLeft === 0}
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/20 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Réinitialisation...</span>
                </div>
              ) : (
                <span>Changer mon mot de passe</span>
              )}
            </Button>
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
        </div>
      </motion.div>
    </div>
  );
}

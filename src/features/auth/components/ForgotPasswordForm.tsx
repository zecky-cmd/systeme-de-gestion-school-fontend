"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { 
  BookMarked, 
  Mail, 
  ArrowLeft,
  Send,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../types";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    // Simulation
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/reset-password";
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
                <BookMarked size={28} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Mot de passe oublié</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm px-4 leading-relaxed">
              Entrez l'adresse email associée à votre compte pour recevoir un lien de réinitialisation.
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
                  placeholder="votreemail@etablissement.ci"
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/20 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Envoi en cours...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Envoyer le lien</span>
                  <Send size={18} />
                </div>
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

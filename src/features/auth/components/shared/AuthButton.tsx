"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface AuthButtonProps {
  type?: "button" | "submit";
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
  icon?: LucideIcon;
  disabled?: boolean;
  onClick?: () => void;
}

export function AuthButton({ 
  type = "submit", 
  isLoading, 
  loadingText = "Chargement...", 
  children, 
  icon: Icon,
  disabled,
  onClick
}: AuthButtonProps) {
  return (
    <Button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/20 transition-all active:scale-[0.98]"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {children}
          {Icon && <Icon size={18} />}
        </div>
      )}
    </Button>
  );
}

"use client";

import { ReactNode, forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  labelRightElement?: ReactNode;
  inputRightElement?: ReactNode;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, icon: Icon, error, labelRightElement, inputRightElement, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor={props.id} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </Label>
          {labelRightElement}
        </div>
        <div className="relative group">
          {Icon && (
            <div className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <Icon size={16} />
            </div>
          )}
          <Input
            ref={ref}
            className={cn(
              Icon && "pl-10",
              inputRightElement && "pr-10",
              "h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-emerald-500/20",
              error && "border-red-500 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
          {inputRightElement && (
            <div className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {inputRightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium ml-1 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthField.displayName = "AuthField";

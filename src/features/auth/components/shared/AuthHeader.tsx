"use client";

import { LucideIcon } from "lucide-react";

interface AuthHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  showMobileLogo?: boolean;
}

export function AuthHeader({ icon: Icon, title, description, showMobileLogo = true }: AuthHeaderProps) {
  return (
    <div className="text-center space-y-2 mb-10">
      {/* Mobile Icon */}
      {showMobileLogo && (
        <div className="lg:hidden flex justify-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
            <Icon className="h-8 w-8" />
          </div>
        </div>
      )}
      
      {/* Desktop/Common Icon */}
      <div className="hidden lg:flex justify-center mb-6">
        <div className="h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
          <Icon size={28} />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm px-4 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

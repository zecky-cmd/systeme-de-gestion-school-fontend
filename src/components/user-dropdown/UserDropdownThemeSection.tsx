"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_OPTIONS } from "./constants";

interface UserDropdownThemeSectionProps {
  theme: string | undefined;
  onThemeChange: (theme: string) => void;
}

export function UserDropdownThemeSection({
  theme,
  onThemeChange,
}: UserDropdownThemeSectionProps) {
  return (
    <div className="p-3">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 block">
        Thème
      </span>
      <div className="space-y-1">
        {THEME_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onThemeChange(option.id)}
            className={cn(
              "flex w-full items-center justify-between px-3 py-2 text-sm rounded-xl transition-all",
              theme === option.id
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-medium"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            )}
          >
            <div className="flex items-center gap-3">
              <option.icon size={18} />
              <span>{option.label}</span>
            </div>
            {theme === option.id && <Check size={16} />}
          </button>
        ))}
      </div>
    </div>
  );
}

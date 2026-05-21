"use client";

import { cn } from "@/lib/utils";
import {
  ENSEIGNANTS_TABS,
  type EnseignantsTabView,
} from "@/features/enseignants/constants/enseignants-list.constants";

interface EnseignantsTabsProps {
  activeTab: EnseignantsTabView;
  onTabChange: (tab: EnseignantsTabView) => void;
}

export function EnseignantsTabs({ activeTab, onTabChange }: EnseignantsTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl w-fit">
      {ENSEIGNANTS_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
            activeTab === tab.id
              ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}

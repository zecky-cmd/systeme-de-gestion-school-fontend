"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CLASSES_CYCLE_TABS,
  type ClassesCycleFilter,
} from "@/features/classes/constants/classes-list.constants";

interface ClassesCycleTabsProps {
  cycleFilter: ClassesCycleFilter;
  onCycleChange: (value: ClassesCycleFilter) => void;
}

const ACTIVE_TAB_CLASS: Record<ClassesCycleFilter, string> = {
  all: "data-[state=active]:bg-white dark:data-[state=active]:bg-emerald-600 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-white",
  col: "data-[state=active]:bg-white dark:data-[state=active]:bg-blue-600 data-[state=active]:text-blue-700 dark:data-[state=active]:text-white",
  lyc: "data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-white",
};

export function ClassesCycleTabs({
  cycleFilter,
  onCycleChange,
}: ClassesCycleTabsProps) {
  return (
    <Tabs
      value={cycleFilter}
      onValueChange={(v) => onCycleChange(v as ClassesCycleFilter)}
      className="w-full md:w-auto"
    >
      <TabsList className="bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 gap-1 h-12">
        {CLASSES_CYCLE_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`rounded-xl px-6 data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest gap-2 ${ACTIVE_TAB_CLASS[tab.value]}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

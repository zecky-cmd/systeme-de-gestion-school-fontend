import { cn } from "@/lib/utils";
import { CONFIG_TABS, ConfigTab } from "../constants/config.constants";
import { ConfigHeader } from "@/components/shared/ConfigHeader";
import { Cog } from "lucide-react";

interface ConfigTopBarProps {
  activeTab: ConfigTab;
  setActiveTab: (tab: ConfigTab) => void;
}

export function ConfigTopBar({ activeTab, setActiveTab }: ConfigTopBarProps) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-[oklch(0.98_0.002_240)] border-b border-[oklch(0.91_0.005_240)] sticky top-0 z-30">
      <ConfigHeader
        icon={Cog}
        title="Configuration"
        description="Paramètres généraux de l'établissement et du système"
      />

      <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-lg w-fit h-auto">
        {CONFIG_TABS.filter(
          (t) => t.id === "etablissement" || t.id === "annee",
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ConfigTab)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 text-xs font-medium",
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40",
              )}
            >
              <Icon
                size={14}
                className={cn(
                  "transition-colors",
                  isActive ? "text-[oklch(0.45_0.15_160)]" : "text-slate-400",
                )}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./UserAvatar";
import type {
  UserDisplayInfo,
  UserDisplaySource,
} from "./utils/user-display.utils";

interface UserDropdownTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  display: UserDisplayInfo;
  user: UserDisplaySource | null;
}

export function UserDropdownTrigger({
  isOpen,
  onToggle,
  display,
  user,
}: UserDropdownTriggerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3 pl-1 sm:pl-2 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 p-1 rounded-full transition-all duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      <UserAvatar
        photoUrl={display.photoUrl}
        alt={display.fullName}
        initials={display.initials}
        size="sm"
        className="transition-all group-hover:ring-emerald-500/30"
      />
      <div className="hidden md:flex flex-col text-left leading-tight mr-1">
        <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
          {user?.nom}
        </span>
        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
          {display.roleLabel}
        </span>
      </div>
      <ChevronDown
        size={14}
        className={cn(
          "text-slate-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

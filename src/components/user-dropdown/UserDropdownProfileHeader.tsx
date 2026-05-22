"use client";

import { UserAvatar } from "./UserAvatar";
import type { UserDisplayInfo } from "./utils/user-display.utils";

interface UserDropdownProfileHeaderProps {
  display: UserDisplayInfo;
}

export function UserDropdownProfileHeader({
  display,
}: UserDropdownProfileHeaderProps) {
  return (
    <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="flex items-center gap-3 mb-1">
        <UserAvatar
          photoUrl={display.photoUrl}
          alt={display.fullName}
          initials={display.initials}
          size="md"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate uppercase">
            {display.fullName}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {display.email}
          </span>
        </div>
      </div>
    </div>
  );
}

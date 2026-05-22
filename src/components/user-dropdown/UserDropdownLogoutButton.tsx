"use client";

import { LogOut } from "lucide-react";

interface UserDropdownLogoutButtonProps {
  onLogout: () => void;
}

export function UserDropdownLogoutButton({
  onLogout,
}: UserDropdownLogoutButtonProps) {
  return (
    <div className="p-2">
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
      >
        <LogOut size={18} />
        <span>Déconnexion</span>
      </button>
    </div>
  );
}

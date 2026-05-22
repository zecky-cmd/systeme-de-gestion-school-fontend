"use client";

import { motion } from "framer-motion";
import { UserDropdownProfileHeader } from "./UserDropdownProfileHeader";
import { UserDropdownThemeSection } from "./UserDropdownThemeSection";
import { UserDropdownLogoutButton } from "./UserDropdownLogoutButton";
import type { UserDisplayInfo } from "./utils/user-display.utils";

function DropdownDivider() {
  return <div className="h-px bg-slate-100 dark:bg-slate-800/60 mx-2" />;
}

interface UserDropdownPanelProps {
  display: UserDisplayInfo;
  theme: string | undefined;
  onThemeChange: (theme: string) => void;
  onLogout: () => void;
}

export function UserDropdownPanel({
  display,
  theme,
  onThemeChange,
  onLogout,
}: UserDropdownPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none z-50 overflow-hidden"
    >
      <UserDropdownProfileHeader display={display} />
      <DropdownDivider />
      <UserDropdownThemeSection theme={theme} onThemeChange={onThemeChange} />
      <DropdownDivider />
      <UserDropdownLogoutButton onLogout={onLogout} />
    </motion.div>
  );
}

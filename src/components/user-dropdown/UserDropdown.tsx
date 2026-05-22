"use client";

import { AnimatePresence } from "framer-motion";
import { useUserDropdown } from "./hooks/useUserDropdown";
import { UserDropdownTrigger } from "./UserDropdownTrigger";
import { UserDropdownPanel } from "./UserDropdownPanel";

export function UserDropdown() {
  const {
    isOpen,
    toggle,
    dropdownRef,
    user,
    display,
    theme,
    setTheme,
    handleLogout,
  } = useUserDropdown();

  return (
    <div className="relative" ref={dropdownRef}>
      <UserDropdownTrigger
        isOpen={isOpen}
        onToggle={toggle}
        display={display}
        user={user}
      />

      <AnimatePresence>
        {isOpen && (
          <UserDropdownPanel
            display={display}
            theme={theme}
            onThemeChange={setTheme}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

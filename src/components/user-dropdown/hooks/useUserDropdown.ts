"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { getUserDisplayInfo } from "../utils/user-display.utils";

export function useUserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();

  const display = getUserDisplayInfo(user);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleLogout = useCallback(() => {
    logout();
    window.location.href = "/login";
  }, [logout]);

  return {
    isOpen,
    toggle,
    close,
    dropdownRef,
    user,
    display,
    theme,
    setTheme,
    handleLogout,
  };
}

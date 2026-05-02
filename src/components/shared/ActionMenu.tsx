"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ActionMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface ActionMenuProps {
  items: ActionMenuItem[];
}

export function ActionMenu({ items }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null); // 1. Ref sur le menu réel

  // 2. Calcul basé sur la vraie hauteur du menu
  const calculateDirection = useCallback(() => {
    if (!triggerRef.current || !floatingRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuHeight = floatingRef.current.offsetHeight; // hauteur réelle
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    setOpenUpward(spaceBelow < menuHeight && spaceAbove > spaceBelow);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // 3. Fermeture avec Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-haspopup="true"           // 4. Accessibilité
        aria-expanded={isOpen}
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        onClick={handleToggle}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          //5. Menu rendu invisible d'abord pour mesurer, puis repositionné
          <motion.div
            ref={floatingRef}
            onAnimationStart={calculateDirection} // mesure avant l'animation
            initial={{ opacity: 0, y: openUpward ? -4 : 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? -4 : 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none z-50 overflow-hidden py-1",
              openUpward
                ? "bottom-full mb-1 origin-bottom-right"
                : "top-full mt-1 origin-top-right"
            )}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors",
                  item.variant === "danger"
                    ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-medium"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
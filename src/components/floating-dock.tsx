"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CreditCard,
  Calendar,
  UserX,
  MessageSquare,
  Settings,
  BookMarked,
  Minimize2,
  Maximize2
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/eleves", icon: Users, label: "Eleves" },
  { href: "/classes", icon: GraduationCap, label: "Classes" },
  { href: "/enseignants", icon: BookOpen, label: "Enseignants" },
  { href: "/notes", icon: ClipboardList, label: "Notes & Bulletins" },
  { href: "/paiements", icon: CreditCard, label: "Paiements" },
  { href: "/emplois", icon: Calendar, label: "Emplois du temps" },
  { href: "/absences", icon: UserX, label: "Absences & Discipline" },
  { href: "/messagerie", icon: MessageSquare, label: "Messagerie" },
  { href: "/config", icon: Settings, label: "Configuration" },
];

export function FloatingDock() {
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();

  const activeItem = NAV_ITEMS.find((item) => item.href === pathname) || NAV_ITEMS[0];

  return (
    <TooltipProvider>
      <motion.div
        drag
        dragMomentum={false}
        className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4 py-2 shadow-xl shadow-black/10 backdrop-blur-xl dark:shadow-white/5"
        style={{ x: "-50%" }} // Centré horizontalement au départ
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Brand Icon (Always visible) */}
        <div className="flex shrink-0 items-center justify-center rounded-xl bg-emerald-600 p-2 text-white shadow-sm">
          <BookMarked className="h-5 w-5" />
        </div>

        <AnimatePresence mode="popLayout">
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center"
            >
              <div className="mx-2 hidden sm:block whitespace-nowrap text-sm font-semibold text-foreground">
                EduManager CI
              </div>

              {/* Séparateur */}
              <div className="mx-2 h-6 w-px bg-border group-data-[collapsible=icon]:hidden"></div>

              {/* Liens de navigation */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[50vw]">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger render={<Link href={item.href} />}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground",
                            isActive && "text-emerald-600 dark:text-emerald-400"
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="dock-indicator"
                              className="absolute inset-0 rounded-xl bg-emerald-100 dark:bg-emerald-900/30"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <item.icon className="relative z-10 h-5 w-5" />
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Theme Toggle au lieu du "2/13" */}
              <div className="mx-2 flex shrink-0 items-center gap-2">
                <div className="h-6 w-px bg-border"></div>
                <ThemeToggle />
              </div>
            </motion.div>
          )}

          {isMinimized && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="mx-3 whitespace-nowrap text-sm font-medium text-foreground"
            >
              {activeItem.label}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouton Réduire / Agrandir */}
        <Tooltip>
          <TooltipTrigger
            onClick={() => setIsMinimized(!isMinimized)}
            className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{isMinimized ? "Agrandir le menu" : "Réduire le menu"}</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </TooltipProvider>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus, RefreshCw, ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    className?: string;
  };
  /** Afficher le bouton d'exportation */
  showExport?: boolean;
  onExport?: () => void;
  /** Afficher le bouton de rafraîchissement */
  showRefresh?: boolean;
  onRefresh?: () => void;
  /** État de chargement pour l'animation du bouton refresh */
  isRefreshing?: boolean;
  /** Slot d'actions libres pour tout autre composant (recherche, filtres, ou boutons spécifiques) */
  actions?: React.ReactNode;
  /** Classes CSS supplémentaires pour personnaliser l'en-tête */
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actionButton,
  showExport = false,
  onExport,
  showRefresh = false,
  onRefresh,
  isRefreshing = false,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 mb-6 sm:mb-8", className)}>
      {/* 1. Fil d'Ariane (Breadcrumbs) si fournis */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">
            <Home size={14} />
            Accueil
          </span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={12} className="text-slate-300 dark:text-slate-700" />
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-600 dark:text-slate-400 font-bold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* 2. Contenu principal (Titre + Description vs Actions) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Titre et description */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions à droite */}
        <div className="flex items-center flex-wrap gap-2.5 sm:justify-end">
          {/* Actions personnalisées supplémentaires passées par slot */}
          {actions}

          {/* Bouton Rafraîchir */}
          {showRefresh && onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-10 px-3 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all rounded-xl"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4 transition-transform text-slate-500 dark:text-slate-400",
                  isRefreshing && "animate-spin text-emerald-600 dark:text-emerald-500"
                )}
              />
            </Button>
          )}

          {/* Bouton Exporter */}
          {showExport && onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-10 gap-2 text-xs font-black border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all rounded-xl text-slate-700 dark:text-slate-300"
            >
              <Download size={14} className="text-slate-400 dark:text-slate-500" />
              EXPORTER
            </Button>
          )}

          {/* Bouton d'action principal */}
          {actionButton && (
            <Button
              onClick={actionButton.onClick}
              className={cn(
                "h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 gap-2 border-0 transition-all active:scale-95 rounded-xl flex items-center justify-center",
                actionButton.className
              )}
            >
              {actionButton.icon || <Plus size={16} strokeWidth={3} />}
              {actionButton.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

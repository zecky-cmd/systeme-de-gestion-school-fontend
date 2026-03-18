import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  showExport?: boolean;
  onExport?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  actionButton,
  showExport = false,
  onExport,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {showExport && (
          <Button variant="outline" onClick={onExport} className="bg-background border-input text-foreground hover:bg-accent hover:text-accent-foreground">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        )}
        
        {actionButton && (
          <Button 
            onClick={actionButton.onClick} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            {actionButton.label}
          </Button>
        )}
      </div>
    </div>
  );
}

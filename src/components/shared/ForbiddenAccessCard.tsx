import { LucideIcon, ShieldX } from "lucide-react";

interface ForbiddenAccessCardProps {
  title?: string;
  message?: string;
  icon?: LucideIcon;
}

export function ForbiddenAccessCard({
  title = "Accès Non Autorisé",
  message = "Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page. Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur.",
  icon: Icon = ShieldX,
}: ForbiddenAccessCardProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] p-8 text-center bg-card rounded-2xl border border-dashed">
      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-red-600" size={24} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-md">{message}</p>
    </div>
  );
}

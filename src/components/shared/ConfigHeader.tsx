import { LucideIcon } from "lucide-react";
 
interface ConfigHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}
 
export function ConfigHeader({ icon: Icon, title, description }: ConfigHeaderProps) {
  return (
    <div className="p-6 border-b border-[oklch(0.91_0.005_240)] bg-white/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">{title}</h2>
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
 
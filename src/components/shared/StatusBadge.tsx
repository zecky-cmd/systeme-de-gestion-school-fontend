import { STATUS_COLORS } from "@/constants/theme";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  variant?: "status" | "payment" | "cycle";
}

export function StatusBadge({ status, className, variant = "status" }: StatusBadgeProps) {
  // Match exact string or fallback
  const normalizedStatus = status.trim();
  const colorMap = STATUS_COLORS[normalizedStatus] || STATUS_COLORS["default"];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full",
        colorMap.bg,
        colorMap.text,
        colorMap.outline && "border border-slate-200 bg-white",
        className
      )}
    >
      {status}
    </span>
  );
}

import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoefStepperProps {
  value: number;
  onChange: (val: number) => void;
  className?: string;
}

export function CoefStepper({ value, onChange, className }: CoefStepperProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 group-hover:border-emerald-200 transition-all",
      className
    )}>
      <div className="flex-1 text-center font-bold text-slate-700 min-w-[24px]">
        {value}
      </div>
      <div className="flex flex-col border-l border-slate-100 pl-1">
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(Math.min(9, value + 1)); }}
          className="p-0.5 hover:text-emerald-600 transition-colors"
        >
          <ChevronUp size={12} />
        </button>
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(Math.max(0, value - 1)); }}
          className="p-0.5 hover:text-emerald-600 transition-colors"
        >
          <ChevronDown size={12} />
        </button>
      </div>
    </div>
  );
}

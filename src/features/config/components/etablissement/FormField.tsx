import React from "react";
import { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}

export function FormField({ 
  icon: Icon, 
  label, 
  value, 
  onChange, 
  placeholder,
  type = "text"
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-all">
          <Icon size={16} />
        </div>
        <Label className="text-xs font-black uppercase tracking-wider text-slate-500">
          {label}
        </Label>
      </div>
      <Input 
        type={type}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white focus:ring-primary/20 transition-all font-medium text-slate-900"
      />
    </div>
  );
}

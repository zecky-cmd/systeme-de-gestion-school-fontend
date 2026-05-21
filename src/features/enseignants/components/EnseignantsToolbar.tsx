"use client";

import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENSEIGNANT_CONTRACT_FILTER_OPTIONS } from "@/features/enseignants/constants/enseignants-list.constants";

interface EnseignantsToolbarProps {
  search: string;
  filterType: string;
  onSearchChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
}

export function EnseignantsToolbar({
  search,
  filterType,
  onSearchChange,
  onFilterTypeChange,
}: EnseignantsToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full md:w-auto bg-white dark:bg-slate-950 p-1.5 pl-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all flex-1 md:max-w-sm">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <Input
          placeholder="Rechercher un enseignant..."
          className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-9 font-bold text-sm placeholder:text-slate-400 placeholder:font-medium p-0 w-full"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={filterType}
          onValueChange={(val) => val && onFilterTypeChange(val)}
        >
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {ENSEIGNANT_CONTRACT_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          type="button"
          className="rounded-xl h-10 font-bold text-sm gap-2 border-slate-200 dark:border-slate-800"
        >
          <Download size={16} />
          Exporter
        </Button>
      </div>
    </div>
  );
}

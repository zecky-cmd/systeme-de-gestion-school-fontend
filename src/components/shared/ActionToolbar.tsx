import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDef {
  key: string;
  placeholder: string;
  options: FilterOption[];
}

interface ActionToolbarProps {
  searchPlaceholder?: string;
  filters?: FilterDef[];
  onSearchChange?: (val: string) => void;
  onFilterChange?: (key: string, val: string) => void;
}

export function ActionToolbar({
  searchPlaceholder = "Rechercher...",
  filters = [],
  onSearchChange,
  onFilterChange
}: ActionToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Barre de recherche */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={searchPlaceholder}
          className="pl-10 bg-background border-input"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {/* Selecteurs de filtres */}
      {filters.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
          {filters.map((filter) => (
            <select
              key={filter.key}
              className="px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[120px]"
              onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            >
              <option value="">{filter.placeholder}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </div>
  );
}

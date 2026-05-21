import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function TablePagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "éléments",
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const start = totalItems
    ? Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
    : 0;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="p-4 border-t border-border flex items-center justify-between text-sm">
      <div className="text-muted-foreground">
        Affichage de {start} à {end} sur {totalItems} {itemLabel}
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || !totalItems}
        >
          Précédent
        </Button>
        <div className="flex items-center gap-1 px-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Page {currentPage} sur {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!totalItems || currentPage >= totalPages}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}

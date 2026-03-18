import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={`head-${i}`}>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={`row-${rowIndex}`} className="hover:bg-muted/50 transition-colors">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                    {/* Varier légèrement la largeur du skeleton pour faire plus naturel */}
                    <Skeleton className={`h-4 w-[${Math.floor(Math.random() * 40) + 60}%]`} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 border-t border-border flex items-center justify-between">
        <Skeleton className="h-4 w-[200px]" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

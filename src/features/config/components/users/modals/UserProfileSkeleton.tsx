import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function InfoRowSkeleton() {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="h-11 w-11 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5 pt-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

export function UserProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Squelette de l'identité principale */}
      <div className="flex flex-col items-center space-y-2 mt-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Squelette de la grille d'informations */}
      <div className="space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <InfoRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

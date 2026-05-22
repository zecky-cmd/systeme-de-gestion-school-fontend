"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md";

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "size-9 text-xs",
  md: "size-11 text-sm ring-4 ring-white dark:ring-slate-800 shadow-md",
};

interface UserAvatarProps {
  photoUrl?: string;
  alt: string;
  initials: string;
  size?: AvatarSize;
  className?: string;
}

export function UserAvatar({
  photoUrl,
  alt,
  initials,
  size = "sm",
  className,
}: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = photoUrl && !imageFailed;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold overflow-hidden",
        size === "sm" && "ring-2 ring-emerald-500/10",
        SIZE_CLASSES[size],
        className
      )}
    >
      {showImage ? (
        <img
          src={photoUrl}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}

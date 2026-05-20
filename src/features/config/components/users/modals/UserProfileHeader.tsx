import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { ConfigUser } from "@/services/user-management.service";

interface UserProfileHeaderProps {
  user: ConfigUser | null;
  isLoading: boolean;
  onClose: () => void;
  initials: string;
}

export function UserProfileHeader({ user, isLoading, onClose, initials }: UserProfileHeaderProps) {
  return (
    <div className="h-28 bg-primary relative flex items-center px-6">
      <h2 className="text-white text-lg font-bold font-heading">
        Détails de l'utilisateur
      </h2>
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
      >
        <X size={20} />
      </button>

      {/* Avatar Rond ID à cheval */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
        <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
          <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-white border border-white font-bold text-2xl overflow-hidden">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-full bg-primary/30" />
            ) : user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span>{initials || "ID"}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

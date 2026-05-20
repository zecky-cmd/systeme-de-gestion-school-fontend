import React from "react";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import { ConfigUser } from "@/services/user-management.service";
import { getRoleInfo } from "./user-profile.utils";

interface UserProfileInfoProps {
  user: ConfigUser;
}

export function UserProfileInfo({ user }: UserProfileInfoProps) {
  const roleInfo = getRoleInfo(user.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-[#1f2937] font-heading">
        {user.prenom} {user.nom}
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        {user.email}
      </p>
      
      {/* Badges verts de rôles et statuts */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1 flex items-center gap-1.5 text-xs font-semibold shadow-none">
          <RoleIcon size={13} className="text-primary" />
          {roleInfo.label}
        </Badge>
        {user.estActif !== false ? (
          <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1 flex items-center gap-1.5 text-xs font-semibold shadow-none">
            <Check size={13} className="text-primary" />
            Actif
          </Badge>
        ) : (
          <Badge className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-3.5 py-1 flex items-center gap-1.5 text-xs font-semibold shadow-none">
            <X size={13} className="text-rose-700" />
            Inactif
          </Badge>
        )}
      </div>
    </div>
  );
}

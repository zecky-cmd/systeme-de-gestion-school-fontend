import React from "react";
import { Mail, Clock, Calendar } from "lucide-react";
import { ConfigUser } from "@/services/user-management.service";
import { formatDate } from "./user-profile.utils";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}
//  * Ligne d'information réutilisable avec icône circulaire verte
function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900 mt-0.5 break-all">
          {value}
        </p>
      </div>
    </div>
  );
}

interface UserProfileDetailsProps {
  user: ConfigUser;
}

export function UserProfileDetails({ user }: UserProfileDetailsProps) {
  return (
    <div className="space-y-5">
      <InfoRow 
        icon={<Mail size={18} />} 
        label="Adresse Email" 
        value={user.email} 
      />
      <InfoRow 
        icon={<Clock size={18} />} 
        label="Dernière Connexion" 
        value={formatDate(user.derniereConnexion)} 
      />
      <InfoRow 
        icon={<Calendar size={18} />} 
        label="Date de création" 
        value={formatDate(user.createdAt)} 
      />
      <InfoRow 
        icon={<Calendar size={18} />} 
        label="Dernière mise à jour" 
        value={formatDate(user.updatedAt)} 
      />
    </div>
  );
}

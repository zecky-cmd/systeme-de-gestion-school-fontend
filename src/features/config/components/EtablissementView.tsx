import React from "react";
import { Building2, Mail, Phone, MapPin, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SchoolHeader } from "./etablissement/SchoolHeader";
import { FormField } from "./etablissement/FormField";
import { useLogoUpload } from "./etablissement/useLogoUpload";
import { SchoolConfig } from "@/services/school.service";

interface EtablissementViewProps {
  data: Partial<SchoolConfig>;
  onChange: (data: Partial<SchoolConfig>) => void;
  onSave: () => void;
  onLogoChange: (file: File) => void;
  isSaving: boolean;
}

export function EtablissementView({ data, onChange, onSave, onLogoChange, isSaving }: EtablissementViewProps) {
  const { fileInputRef, handleLogoClick, handleFileChange } = useLogoUpload(onLogoChange);

  return (
    <div className="space-y-6">
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
        {/* Banner decorative */}
        <div className="h-32 bg-gradient-to-r from-emerald-500/10 via-primary/5 to-emerald-500/10 border-b border-slate-100/50" />
        
        <CardContent className="relative pt-0 px-8 pb-8">
          <SchoolHeader 
            logoUrl={data.logoUrl}
            nom={data.nom || ""}
            isSaving={isSaving}
            onSave={onSave}
            onLogoClick={handleLogoClick}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Colonne Gauche */}
            <div className="space-y-6">
              <FormField 
                icon={Building2} 
                label="Nom officiel de l'établissement" 
                value={data.nom || ""} 
                onChange={(val) => onChange({ nom: val })} 
                placeholder="Ex: École Excellence"
              />
              <FormField 
                icon={MapPin} 
                label="Adresse physique" 
                value={data.adresse || ""} 
                onChange={(val) => onChange({ adresse: val })} 
                placeholder="Ex: Rue 12, Quartier résidentiel"
              />
              <FormField 
                icon={Coins} 
                label="Devise monétaire" 
                value={data.devise || ""} 
                onChange={(val) => onChange({ devise: val })} 
                placeholder="Ex: FCFA, EUR, USD"
              />
            </div>

            {/* Colonne Droite */}
            <div className="space-y-6">
              <FormField 
                icon={Phone} 
                label="Téléphone de contact" 
                value={data.telephone || ""} 
                onChange={(val) => onChange({ telephone: val })} 
                placeholder="+225 00 00 00 00"
              />
              <FormField 
                icon={Mail} 
                label="Email de contact" 
                value={data.email || ""} 
                onChange={(val) => onChange({ email: val })} 
                placeholder="contact@ecole.com"
                type="email"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

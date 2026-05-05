import React, { useRef } from "react";
import { Building2, Mail, Phone, MapPin, Globe, Shield, User, Camera, Save, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SchoolConfig } from "@/services/school.service";

interface EtablissementViewProps {
  data: Partial<SchoolConfig>;
  onChange: (field: keyof SchoolConfig, value: string) => void;
  onSave: () => void;
  onLogoChange: (file: File) => void;
  isSaving: boolean;
}

export function EtablissementView({ data, onChange, onSave, onLogoChange, isSaving }: EtablissementViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLogoChange(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500/10 via-primary/5 to-blue-500/10 border-b border-slate-100" />
        <CardContent className="relative pt-0 px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-8 -mt-12 items-start">
            <div className="relative group">
              <Avatar className="h-32 w-32 rounded-2xl border-4 border-white shadow-xl bg-white ring-1 ring-slate-100 transition-transform duration-300 group-hover:scale-105">
                <AvatarImage src={data.logoUrl} className="object-contain p-2" />
                <AvatarFallback className="bg-slate-50 text-primary">
                  <Building2 size={48} />
                </AvatarFallback>
              </Avatar>
              <Button 
                onClick={handleLogoClick}
                size="icon" 
                className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg border-2 border-white transition-all active:scale-90"
              >
                <Camera size={16} />
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="flex-1 pt-14 md:pt-16 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading leading-none">{data.nom || "Nom de l'établissement"}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                      <Shield size={10} /> Système Actif
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={onSave}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Save size={18} />
                  {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={12} className="text-primary" /> Nom officiel de l'établissement
                </label>
                <Input 
                  value={data.nom} 
                  onChange={(e) => onChange("nom", e.target.value)}
                  className="h-11 rounded-xl border-slate-200 focus:border-primary/30 focus:ring-primary/10 transition-all text-sm font-medium bg-slate-50/30" 
                  placeholder="Ex: Lycée Excellence"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={12} className="text-primary" /> Adresse physique
                </label>
                <Input 
                  value={data.adresse} 
                  onChange={(e) => onChange("adresse", e.target.value)}
                  className="h-11 rounded-xl border-slate-200 focus:border-primary/30 focus:ring-primary/10 transition-all text-sm font-medium bg-slate-50/30" 
                  placeholder="Ex: 123 Avenue des Écoles"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Coins size={12} className="text-primary" /> Devise monétaire
                </label>
                <Input 
                  value={data.devise} 
                  onChange={(e) => onChange("devise", e.target.value)}
                  className="h-11 rounded-xl border-slate-200 focus:border-primary/30 focus:ring-primary/10 transition-all text-sm font-medium bg-slate-50/30" 
                  placeholder="Ex: F, €, $"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Phone size={12} className="text-primary" /> Téléphone de contact
                </label>
                <div className="relative">
                  <Input 
                    value={data.telephone} 
                    onChange={(e) => onChange("telephone", e.target.value)}
                    className="h-11 rounded-xl border-slate-200 focus:border-primary/30 focus:ring-primary/10 transition-all text-sm font-medium pl-10 bg-slate-50/30" 
                    placeholder="+225 00 00 00 00"
                  />
                  <Phone size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={12} className="text-primary" /> Email de contact
                </label>
                <div className="relative">
                  <Input 
                    value={data.email} 
                    onChange={(e) => onChange("email", e.target.value)}
                    className="h-11 rounded-xl border-slate-200 focus:border-primary/30 focus:ring-primary/10 transition-all text-sm font-medium pl-10 bg-slate-50/30" 
                    placeholder="contact@etablissement.com"
                  />
                  <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

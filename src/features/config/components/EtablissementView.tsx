import React from "react";
import { Upload, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { SchoolConfig } from "@/services/school.service";

interface EtablissementViewProps {
  data: Partial<SchoolConfig>;
  onChange: (field: keyof SchoolConfig, value: string) => void;
}

export function EtablissementView({ data, onChange }: EtablissementViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card Logo (1 colonne) */}
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Logo de l'établissement</CardTitle>
          <CardDescription className="text-xs">Apparaît sur les bulletins et reçus</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer">
             <div className="h-28 w-28 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 bg-secondary/30 group-hover:bg-secondary/40 transition-all duration-300 overflow-hidden">
                {data.logoUrl ? (
                  <img src={data.logoUrl} alt="Logo" className="h-full w-full object-contain p-2" />
                ) : (
                  <>
                    <GraduationCap className="h-8 w-8 text-primary/40" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{data.sigle || "LOGO"}</span>
                  </>
                )}
             </div>
          </div>

          <Button variant="outline" size="sm" className="h-8 rounded-md gap-2 font-medium text-xs px-4">
            <Upload size={14} className="text-primary" />
            Changer le logo
          </Button>
          <p className="text-[10px] text-muted-foreground">Format PNG ou JPG, max 2 Mo</p>
        </CardContent>
      </Card>

      {/* Card Informations (2 colonnes) */}
      <Card className="lg:col-span-2 border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Informations générales</CardTitle>
          <CardDescription className="text-xs">Coordonnées et identité de l'établissement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500">Nom complet</Label>
              <Input 
                value={data.nomComplet}
                onChange={(e) => onChange("nomComplet", e.target.value)}
                placeholder="Ex: Groupe Scolaire Excellence"
                className="h-9 text-xs rounded-md border-slate-200 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500">Sigle</Label>
              <Input 
                value={data.sigle}
                onChange={(e) => onChange("sigle", e.target.value)}
                placeholder="Ex: GSE"
                className="h-9 text-xs rounded-md border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500">N Agrément MENA</Label>
              <Input 
                value={data.agrementMena}
                onChange={(e) => onChange("agrementMena", e.target.value)}
                placeholder="Ex: EP/CI-ABJ/2015/0234"
                className="h-9 text-xs rounded-md border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500">Type d'établissement</Label>
              <Select 
                value={data.typeEtablissement} 
                onValueChange={(val) => onChange("typeEtablissement", val || "")}
              >
                <SelectTrigger className="h-9 text-xs rounded-md border-slate-200">
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-slate-200">
                  <SelectItem value="Prive laique" className="text-xs">Privé laïque</SelectItem>
                  <SelectItem value="Prive confessionnel" className="text-xs">Privé confessionnel</SelectItem>
                  <SelectItem value="Public" className="text-xs">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-slate-500">Adresse</Label>
              <Input 
                value={data.adresse}
                onChange={(e) => onChange("adresse", e.target.value)}
                placeholder="Ex: Cocody, Riviera 2, Lot 45"
                className="h-9 text-xs rounded-md border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500">Ville</Label>
              <Input 
                value={data.ville}
                onChange={(e) => onChange("ville", e.target.value)}
                placeholder="Ex: Abidjan"
                className="h-9 text-xs rounded-md border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500">Téléphone</Label>
              <Input 
                value={data.telephone}
                onChange={(e) => onChange("telephone", e.target.value)}
                placeholder="Ex: +225 27 22 44 56 78"
                className="h-9 text-xs rounded-md border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500">Email</Label>
              <Input 
                value={data.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="Ex: contact@gs-excellence.ci"
                className="h-9 text-xs rounded-md border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500">Directeur / Proviseur</Label>
              <Input 
                value={data.directeur}
                onChange={(e) => onChange("directeur", e.target.value)}
                placeholder="Ex: M. Amadou Kone"
                className="h-9 text-xs rounded-md border-slate-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React from "react";
import { Upload, GraduationCap, Save } from "lucide-react";
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
  onSave: () => void;
  onLogoChange: (file: File) => void;
  isSaving: boolean;
}

export function EtablissementView({ data, onChange, onSave, onLogoChange, isSaving }: EtablissementViewProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card Logo (1 colonne) */}
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900 font-heading">Logo de l'établissement</CardTitle>
          <CardDescription className="text-xs">Apparaît sur les bulletins et reçus</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer" onClick={handleLogoClick}>
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

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogoClick}
            disabled={isSaving}
            className="h-8 rounded-md gap-2 font-medium text-xs px-4 border-slate-200"
          >
            <Upload size={14} className="text-primary" />
            Changer le logo
          </Button>
          <p className="text-[10px] text-muted-foreground">Format PNG ou JPG, max 2 Mo</p>
        </CardContent>
      </Card>

      {/* Card Informations (2 colonnes) */}
      <Card className="lg:col-span-2 border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold text-slate-900 font-heading">Informations générales</CardTitle>
            <CardDescription className="text-xs">Coordonnées et identité de l'établissement</CardDescription>
          </div>
          <Button 
            onClick={onSave}
            disabled={isSaving}
            size="sm" 
            className="h-8 rounded-md bg-primary hover:bg-primary/90 text-white font-semibold px-4 gap-2 text-xs shadow-sm transition-all active:scale-95"
          >
            <Save size={14} />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Nom complet de l'établissement</Label>
              <Input 
                value={data.nomComplet}
                onChange={(e) => onChange("nomComplet", e.target.value)}
                placeholder="Ex: Groupe Scolaire Excellence"
                className="h-9 text-xs rounded-md border-slate-200 focus:ring-primary/20 bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Sigle / Abréviation</Label>
              <Input 
                value={data.sigle}
                onChange={(e) => onChange("sigle", e.target.value)}
                placeholder="Ex: GSE"
                className="h-9 text-xs rounded-md border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">N° Agrément MENA</Label>
              <Input 
                value={data.agrementMena}
                onChange={(e) => onChange("agrementMena", e.target.value)}
                placeholder="Ex: EP/CI-ABJ/2015/0234"
                className="h-9 text-xs rounded-md border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Type d'établissement</Label>
              <Select 
                value={data.typeEtablissement} 
                onValueChange={(val) => onChange("typeEtablissement", val || "")}
              >
                <SelectTrigger className="h-9 text-xs rounded-md border-slate-200 bg-slate-50/30 focus:bg-white transition-all">
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-slate-200 shadow-xl">
                  <SelectItem value="Prive laique" className="text-xs">Privé laïque</SelectItem>
                  <SelectItem value="Prive confessionnel" className="text-xs">Privé confessionnel</SelectItem>
                  <SelectItem value="Public" className="text-xs">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold text-slate-700">Adresse géographique</Label>
              <Input 
                value={data.adresse}
                onChange={(e) => onChange("adresse", e.target.value)}
                placeholder="Ex: Cocody, Riviera 2, Lot 45, face au commissariat"
                className="h-9 text-xs rounded-md border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Ville / Localité</Label>
              <Input 
                value={data.ville}
                onChange={(e) => onChange("ville", e.target.value)}
                placeholder="Ex: Abidjan"
                className="h-9 text-xs rounded-md border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Téléphone de l'administration</Label>
              <Input 
                value={data.telephone}
                onChange={(e) => onChange("telephone", e.target.value)}
                placeholder="Ex: +225 27 22 44 56 78"
                className="h-9 text-xs rounded-md border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Email officiel</Label>
              <Input 
                value={data.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="Ex: contact@gs-excellence.ci"
                className="h-9 text-xs rounded-md border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Directeur / Chef d'établissement</Label>
              <Input 
                value={data.directeur}
                onChange={(e) => onChange("directeur", e.target.value)}
                placeholder="Ex: M. Amadou Kone"
                className="h-9 text-xs rounded-md border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

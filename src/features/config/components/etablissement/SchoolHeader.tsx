import React from "react";
import { Camera, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SchoolHeaderProps {
  logoUrl?: string;
  nom: string;
  isSaving: boolean;
  onSave: () => void;
  onLogoClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SchoolHeader({
  logoUrl,
  nom,
  isSaving,
  onSave,
  onLogoClick,
  fileInputRef,
  onFileChange
}: SchoolHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-end justify-between gap-6">
      <div className="flex items-end gap-6 -mt-16">
        <div className="relative group">
          <Avatar className="h-40 w-40 rounded-3xl border-8 border-white shadow-xl bg-white overflow-hidden ring-1 ring-slate-100">
            <AvatarImage src={logoUrl} className="object-contain" />
            <AvatarFallback className="bg-slate-50 text-slate-300 text-4xl font-black">
              {nom?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <button 
            onClick={onLogoClick}
            className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-10"
          >
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={onFileChange}
            className="hidden" 
            accept="image/*"
          />
        </div>
        <div className="pb-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mon Établissement</h2>
          <p className="text-slate-500 font-medium">Configurez les informations d'identité de votre école</p>
        </div>
      </div>

      <div className="pb-2">
        <Button 
          onClick={onSave}
          disabled={isSaving}
          className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save size={18} />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

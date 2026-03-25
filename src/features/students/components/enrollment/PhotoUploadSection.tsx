"use client";

import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusIcon, XIcon } from "lucide-react";
import { StudentFormValues } from "../../schemas/student-form.schema";

interface PhotoUploadSectionProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  localPreview: string | null;
  setLocalPreview: (url: string | null) => void;
}

export function PhotoUploadSection({
  selectedFile,
  setSelectedFile,
  localPreview,
  setLocalPreview
}: PhotoUploadSectionProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<StudentFormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const nom = watch("nom");
  const photoUrl = watch("photoUrl");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setLocalPreview(url);
      setValue("photoUrl", "");
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setLocalPreview(null);
    setValue("photoUrl", "");
  };

  const previewSrc = localPreview || photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${nom || "User"}`;

  return (
    <div className="flex flex-col items-center justify-center pb-6 space-y-4">
      <div 
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-24 h-24 rounded-full border-4 border-emerald-100 dark:border-emerald-900/30 overflow-hidden bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center transition-all group-hover:border-emerald-500 shadow-sm">
          <img 
            src={previewSrc} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-950 shadow-lg transform translate-x-1 translate-y-1 group-hover:scale-110 transition-transform">
          <PlusIcon className="h-3 w-3" />
        </div>
        <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-[10px] text-white font-bold uppercase tracking-tight">Changer</span>
        </div>
        
        {(localPreview || photoUrl) && (
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-950 shadow-md hover:bg-red-600 transition-colors z-10"
          >
            <XIcon className="h-3 w-3" />
          </button>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="w-full space-y-2 text-center">
        <Label htmlFor="photoUrl" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ou coller l'URL d'une image</Label>
        <Input 
          id="photoUrl" 
          {...register("photoUrl")} 
          placeholder="https://..."
          className="h-7 text-[11px] bg-slate-50 dark:bg-slate-900/40 border-dashed text-center"
        />
        {errors.photoUrl && <p className="text-[10px] text-red-500">{errors.photoUrl.message}</p>}
      </div>
    </div>
  );
}

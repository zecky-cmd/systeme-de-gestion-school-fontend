import { useRef } from "react";

export function useLogoUpload(onLogoChange: (file: File) => void) {
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

  return {
    fileInputRef,
    handleLogoClick,
    handleFileChange
  };
}

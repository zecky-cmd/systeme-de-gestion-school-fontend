import { useRef } from "react";

export function usePrintSchedule() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    
    // On peut ajouter une logique plus complexe ici si besoin (ex: titre dynamique)
    window.print();
  };

  return {
    printRef,
    handlePrint
  };
}

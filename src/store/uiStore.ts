import { create } from "zustand";

interface UIState {
  academicYear: string;
  isSidebarOpenOnMobile: boolean;
  setAcademicYear: (year: string) => void;
  toggleSidebarMobile: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  academicYear: "Année scolaire 2025-2026",
  isSidebarOpenOnMobile: false,
  
  setAcademicYear: (year) => set({ academicYear: year }),
  
  toggleSidebarMobile: () => 
    set((state) => ({ isSidebarOpenOnMobile: !state.isSidebarOpenOnMobile })),
}));

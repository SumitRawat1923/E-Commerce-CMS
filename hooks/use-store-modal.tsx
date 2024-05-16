import { create } from "zustand";

interface useStoreModelInterface {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useStoreModal = create<useStoreModelInterface>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),

  onClose: () => set({ isOpen: false }),
}));



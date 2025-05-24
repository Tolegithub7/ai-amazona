import { create } from "zustand";

type CartDrawerState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useCartDrawer = create<CartDrawerState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
})); 
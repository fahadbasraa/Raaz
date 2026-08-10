"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  productSlug: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  lastAddedAt: number;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAddedAt: 0,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);

        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
            isOpen: true,
            lastAddedAt: Date.now(),
          });
        } else {
          set({
            items: [...items, { ...item, quantity }],
            isOpen: true,
            lastAddedAt: Date.now(),
          });
        }
      },

      removeItem: (variantId) =>
        set({ items: get().items.filter((i) => i.variantId !== variantId) }),

      setQuantity: (variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          ),
        });
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: "raaz-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

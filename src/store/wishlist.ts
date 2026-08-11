"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  productSlug: string;
  name: string;
  image: string;
  price: number;
};

type WishlistState = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (productSlug: string) => void;
  has: (productSlug: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (item) => {
        const exists = get().items.some(
          (i) => i.productSlug === item.productSlug,
        );
        if (exists) {
          set({
            items: get().items.filter(
              (i) => i.productSlug !== item.productSlug,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      remove: (productSlug) =>
        set({
          items: get().items.filter((i) => i.productSlug !== productSlug),
        }),

      has: (productSlug) =>
        get().items.some((i) => i.productSlug === productSlug),
    }),
    { name: "raaz-wishlist" },
  ),
);

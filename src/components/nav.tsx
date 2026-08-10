"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore, cartCount } from "@/store/cart";

export function Nav() {
  const [solid, setSolid] = useState(false);
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.open);
  const lastAddedAt = useCartStore((s) => s.lastAddedAt);
  const count = cartCount(items);

  useEffect(() => {
    function onScroll() {
      setSolid(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        solid
          ? "bg-base/90 backdrop-blur-md border-b border-ivory/10"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="font-display text-xl italic tracking-wide text-ivory"
        >
          RAAZ
        </Link>

        <div className="eyebrow hidden gap-8 text-xs text-ivory/80 sm:flex">
          <a href="#collection" className="transition-colors hover:text-gold">
            Shop
          </a>
          <a href="#atelier" className="transition-colors hover:text-gold">
            Atelier
          </a>
        </div>

        <div className="eyebrow flex items-center gap-6 text-xs text-ivory/80">
          <Link href="/account" className="transition-colors hover:text-gold">
            Account
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`View bag, ${count} item${count === 1 ? "" : "s"}`}
            className="flex items-center gap-1.5 transition-colors hover:text-gold"
          >
            Bag
            {count > 0 && (
              <motion.span
                key={lastAddedAt}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-base"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

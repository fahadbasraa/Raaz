"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCartStore, cartCount } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

const EASE_OUT_SLOW = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.open);
  const lastAddedAt = useCartStore((s) => s.lastAddedAt);
  const count = cartCount(items);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    function onScroll() {
      setSolid(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const accountHref = session?.user ? "/account" : "/login";
  const accountLabel = session?.user ? "Account" : "Sign in";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        solid || menuOpen
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
          <Link
            href={accountHref}
            className="hidden transition-colors hover:text-gold sm:inline"
          >
            {accountLabel}
          </Link>
          <Link
            href="/wishlist"
            className="hidden items-center gap-1.5 transition-colors hover:text-gold sm:flex"
          >
            Saved
            {wishlistCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-base">
                {wishlistCount}
              </span>
            )}
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
                transition={{ duration: 0.4, ease: EASE_OUT_SLOW }}
                className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-base"
              >
                {count}
              </motion.span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex flex-col gap-1.5 sm:hidden"
          >
            <motion.span
              className="block h-px w-5 bg-ivory"
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 3.5 : 0,
              }}
              transition={{ duration: 0.4, ease: EASE_OUT_SLOW }}
            />
            <motion.span
              className="block h-px w-5 bg-ivory"
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -3.5 : 0,
              }}
              transition={{ duration: 0.4, ease: EASE_OUT_SLOW }}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_SLOW }}
            className="overflow-hidden border-t border-ivory/10 sm:hidden"
          >
            <div className="eyebrow flex flex-col gap-6 px-6 py-8 text-sm text-ivory/80">
              <a
                href="#collection"
                onClick={() => setMenuOpen(false)}
                className="transition-colors hover:text-gold"
              >
                Shop
              </a>
              <a
                href="#atelier"
                onClick={() => setMenuOpen(false)}
                className="transition-colors hover:text-gold"
              >
                Atelier
              </a>
              <Link
                href={accountHref}
                onClick={() => setMenuOpen(false)}
                className="transition-colors hover:text-gold"
              >
                {accountLabel}
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="transition-colors hover:text-gold"
              >
                Saved{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

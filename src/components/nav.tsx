"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Nav() {
  const [solid, setSolid] = useState(false);

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
          <Link
            href="/cart"
            aria-label="View bag"
            className="transition-colors hover:text-gold"
          >
            Bag
          </Link>
        </div>
      </nav>
    </header>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const EASE_OUT_SLOW = [0.16, 1, 0.3, 1] as const;

const HEADLINE_LINES = ["Kept quiet.", "Worn loudly."];

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex h-screen min-h-[640px] w-full items-end overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: prefersReducedMotion ? 1 : 1.08 }}
        transition={{ duration: 22, ease: "linear" }}
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=2000&q=80&auto=format)",
          }}
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,21,18,0.55) 0%, rgba(14,21,18,0.25) 40%, rgba(14,21,18,0.92) 100%)",
        }}
      />

      <div className="relative z-10 w-full px-6 pb-20 sm:px-10 sm:pb-28">
        <div className="mx-auto max-w-7xl">
          <motion.p
            className="eyebrow mb-6 text-xs text-gold"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: EASE_OUT_SLOW,
              delay: prefersReducedMotion ? 0 : 1.3,
            }}
          >
            New collection — unveiled
          </motion.p>

          <h1 className="font-display text-6xl font-light leading-[0.95] text-ivory sm:text-8xl">
            {HEADLINE_LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 1.1,
                    ease: EASE_OUT_SLOW,
                    delay: prefersReducedMotion ? 0 : 1.4 + i * 0.15,
                  }}
                >
                  {i === HEADLINE_LINES.length - 1 ? (
                    <span className="italic text-gold">{line}</span>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: EASE_OUT_SLOW,
              delay: prefersReducedMotion ? 0 : 2.1,
            }}
          >
            <Link
              href="#collection"
              className="eyebrow inline-flex items-center gap-3 border-b border-ivory/40 pb-2 text-xs text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              Enter the collection
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

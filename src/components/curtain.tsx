"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT_SLOW = [0.16, 1, 0.3, 1] as const;
const SESSION_KEY = "raaz-curtain-seen";

export function Curtain() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"hidden" | "held" | "lifting" | "gone">(
    "hidden",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (prefersReducedMotion || sessionStorage.getItem(SESSION_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with sessionStorage, only readable client-side
      setPhase("gone");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    document.body.style.overflow = "hidden";
    setPhase("held");

    const liftTimer = window.setTimeout(() => setPhase("lifting"), 1000);
    const goneTimer = window.setTimeout(() => {
      setPhase("gone");
      document.body.style.overflow = "";
    }, 2200);

    return () => {
      window.clearTimeout(liftTimer);
      window.clearTimeout(goneTimer);
      document.body.style.overflow = "";
    };
  }, [prefersReducedMotion]);

  if (phase === "gone" || phase === "hidden") return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-base"
      initial={{ y: 0 }}
      animate={{ y: phase === "lifting" ? "-100%" : 0 }}
      transition={{ duration: 1.2, ease: EASE_OUT_SLOW }}
    >
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "lifting" ? 0 : 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT_SLOW }}
      >
        <span className="font-display text-4xl italic tracking-wide text-ivory">
          راز
        </span>
        <span className="eyebrow text-xs text-taupe">Unveiling</span>
      </motion.div>
    </motion.div>
  );
}

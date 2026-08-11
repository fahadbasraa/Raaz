"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE_OUT_SLOW = [0.16, 1, 0.3, 1] as const;

const SIZE_ROWS = [
  { size: "XS", chest: '32–33"', waist: '25–26"', hip: '35–36"' },
  { size: "S", chest: '34–35"', waist: '27–28"', hip: '37–38"' },
  { size: "M", chest: '36–37"', waist: '29–30"', hip: '39–40"' },
  { size: "L", chest: '38–40"', waist: '31–33"', hip: '41–43"' },
  { size: "XL", chest: '41–43"', waist: '34–36"', hip: '44–46"' },
];

export function SizeGuide() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[11px] text-taupe underline decoration-taupe/40 underline-offset-2 transition-colors hover:text-gold hover:decoration-gold"
      >
        Size guide
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT_SLOW }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Size guide"
              className="fixed left-1/2 top-1/2 z-[95] w-[calc(100%-3rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-surface p-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: EASE_OUT_SLOW }}
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow text-xs text-gold">Size guide</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close size guide"
                  className="text-taupe transition-colors hover:text-gold"
                >
                  Close
                </button>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-taupe">
                Every piece is made to order, so a size here is a starting
                point rather than a promise — body measurements in inches.
                If you fall between two sizes, we run true to size; size up
                for a looser fit.
              </p>

              <table className="mt-6 w-full text-left text-sm">
                <thead>
                  <tr className="eyebrow border-b border-ivory/10 text-[10px] text-taupe">
                    <th className="py-2 font-normal">Size</th>
                    <th className="py-2 font-normal">Chest</th>
                    <th className="py-2 font-normal">Waist</th>
                    <th className="py-2 font-normal">Hip</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_ROWS.map((row) => (
                    <tr key={row.size} className="border-b border-ivory/10">
                      <td className="py-3 text-ivory">{row.size}</td>
                      <td className="py-3 text-taupe">{row.chest}</td>
                      <td className="py-3 text-taupe">{row.waist}</td>
                      <td className="py-3 text-taupe">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-6 text-[11px] text-taupe">
                Still unsure? Email{" "}
                <a
                  href="mailto:hello@raaz.com"
                  className="text-ivory underline decoration-ivory/30 underline-offset-2 hover:text-gold"
                >
                  hello@raaz.com
                </a>{" "}
                with your measurements and we&apos;ll tell you what to order.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

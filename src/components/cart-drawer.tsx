"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";

const EASE_OUT_SLOW = [0.16, 1, 0.3, 1] as const;

export function CartDrawer() {
  const { items, isOpen, close, removeItem, setQuantity } = useCartStore();
  const subtotal = cartSubtotal(items);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_SLOW }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-surface"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: EASE_OUT_SLOW }}
          >
            <div className="flex items-center justify-between border-b border-ivory/10 px-6 py-5">
              <p className="eyebrow text-xs text-ivory">
                Your Bag {items.length > 0 && `(${items.length})`}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close bag"
                className="text-taupe transition-colors hover:text-gold"
              >
                Close
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="font-display text-xl italic text-ivory">
                  Nothing kept quiet yet.
                </p>
                <p className="text-sm text-taupe">
                  Whatever you choose will wait for you here.
                </p>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-6 py-6">
                {items.map((item) => (
                  <li
                    key={item.variantId}
                    className="flex gap-4 border-b border-ivory/10 py-6 first:pt-0"
                  >
                    <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-base">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-display text-base text-ivory">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-taupe">
                          {item.color} — {item.size}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-ivory/20">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              setQuantity(item.variantId, item.quantity - 1)
                            }
                            className="px-3 py-1 text-ivory/70 transition-colors hover:text-gold"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-sm text-ivory">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              setQuantity(item.variantId, item.quantity + 1)
                            }
                            className="px-3 py-1 text-ivory/70 transition-colors hover:text-gold"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm text-ivory">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="mt-2 self-start text-xs text-taupe underline-offset-2 transition-colors hover:text-gold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {items.length > 0 && (
              <div className="border-t border-ivory/10 px-6 py-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-taupe">Subtotal</span>
                  <span className="text-ivory">{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-taupe">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="eyebrow mt-6 block w-full border border-ivory/40 py-4 text-center text-xs text-ivory transition-colors hover:border-gold hover:text-gold"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

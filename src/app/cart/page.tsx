"use client";

import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, setQuantity } = useCartStore();
  const subtotal = cartSubtotal(items);

  return (
    <>
      <Nav />
      <main className="flex-1 px-6 pt-32 pb-28 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-xs text-gold">Your bag</p>
          <h1 className="mt-3 font-display text-4xl font-light text-ivory">
            What you&apos;re keeping quiet
          </h1>

          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-sm text-taupe">
                Your bag is empty — nothing chosen yet.
              </p>
              <Link
                href="/#collection"
                className="eyebrow mt-6 inline-block border-b border-ivory/40 pb-1 text-xs text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                Enter the collection
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-12 divide-y divide-ivory/10 border-t border-ivory/10">
                {items.map((item) => (
                  <li key={item.variantId} className="flex gap-6 py-8">
                    <div className="relative h-40 w-28 shrink-0 overflow-hidden bg-surface">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/product/${item.productSlug}`}
                          className="font-display text-xl text-ivory transition-colors hover:text-gold"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-taupe">
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
                            className="px-3 py-1.5 text-ivory/70 transition-colors hover:text-gold"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-sm text-ivory">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              setQuantity(item.variantId, item.quantity + 1)
                            }
                            className="px-3 py-1.5 text-ivory/70 transition-colors hover:text-gold"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-ivory">
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

              <div className="mt-10 flex flex-col items-end gap-2 border-t border-ivory/10 pt-8">
                <div className="flex w-full max-w-xs items-center justify-between text-sm">
                  <span className="text-taupe">Subtotal</span>
                  <span className="text-ivory">{formatPrice(subtotal)}</span>
                </div>
                <p className="max-w-xs text-right text-xs text-taupe">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  className="eyebrow mt-4 w-full max-w-xs border border-ivory/40 py-4 text-center text-xs text-ivory transition-colors hover:border-gold hover:text-gold"
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

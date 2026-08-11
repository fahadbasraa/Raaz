"use client";

import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice } from "@/lib/format";

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();

  return (
    <>
      <Nav />
      <main className="flex-1 px-6 pt-32 pb-28 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-xs text-gold">Saved</p>
          <h1 className="mt-3 font-display text-4xl font-light text-ivory">
            What you&apos;re considering
          </h1>

          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-sm text-taupe">
                Nothing saved yet — nothing chosen, nothing lost.
              </p>
              <Link
                href="/#collection"
                className="eyebrow mt-6 inline-block border-b border-ivory/40 pb-1 text-xs text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                Enter the collection
              </Link>
            </div>
          ) : (
            <ul className="mt-12 divide-y divide-ivory/10 border-t border-ivory/10">
              {items.map((item) => (
                <li key={item.productSlug} className="flex gap-6 py-8">
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
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <Link
                        href={`/product/${item.productSlug}`}
                        className="eyebrow text-[11px] text-ivory underline decoration-ivory/30 underline-offset-2 hover:text-gold hover:decoration-gold"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(item.productSlug)}
                        className="text-xs text-taupe underline-offset-2 transition-colors hover:text-gold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

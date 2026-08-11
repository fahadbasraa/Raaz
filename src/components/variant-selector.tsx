"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";

type Variant = {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
};

export function VariantSelector({
  variants,
  productName,
  productSlug,
  image,
  color,
  onColorChange,
}: {
  variants: Variant[];
  productName: string;
  productSlug: string;
  image: string;
  color: string;
  onColorChange: (color: string) => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color))],
    [variants],
  );
  const sizes = useMemo(
    () => [...new Set(variants.map((v) => v.size))],
    [variants],
  );

  const [size, setSize] = useState<string | null>(null);

  const selected = variants.find((v) => v.color === color && v.size === size);
  const availableSizesForColor = new Set(
    variants.filter((v) => v.color === color && v.stock > 0).map((v) => v.size),
  );

  return (
    <div>
      <p className="text-2xl text-ivory">
        {formatPrice(selected?.price ?? variants[0].price)}
      </p>

      <div className="mt-8">
        <p className="eyebrow text-[11px] text-taupe">
          Color — <span className="text-ivory">{color}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onColorChange(c);
                setSize(null);
              }}
              aria-pressed={c === color}
              className={`eyebrow border px-4 py-2 text-[11px] transition-colors ${
                c === color
                  ? "border-gold text-gold"
                  : "border-ivory/25 text-ivory/70 hover:border-ivory/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="eyebrow text-[11px] text-taupe">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((s) => {
            const disabled = !availableSizesForColor.has(s);
            return (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onClick={() => setSize(s)}
                aria-pressed={s === size}
                className={`eyebrow min-w-11 border px-3 py-2 text-[11px] transition-colors ${
                  disabled
                    ? "cursor-not-allowed border-ivory/10 text-taupe/40 line-through"
                    : s === size
                      ? "border-gold text-gold"
                      : "border-ivory/25 text-ivory/70 hover:border-ivory/60"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={!selected}
        aria-disabled={!selected}
        onClick={() => {
          if (!selected) return;
          addItem({
            variantId: selected.id,
            productSlug,
            name: productName,
            image,
            size: selected.size,
            color: selected.color,
            price: selected.price,
          });
        }}
        className="eyebrow mt-10 w-full border border-ivory/40 py-4 text-xs text-ivory transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {selected ? "Add to Bag" : "Select a size"}
      </button>

      <p className="mt-4 text-center text-[11px] text-taupe">
        {selected && selected.stock <= 3 && selected.stock > 0
          ? `Only ${selected.stock} left`
          : "Made to order — ships in 2–3 weeks"}
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { VariantSelector } from "@/components/variant-selector";
import { WishlistButton } from "@/components/wishlist-button";

type Variant = {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
};

export function ProductView({
  productName,
  productSlug,
  description,
  categoryName,
  fallbackImages,
  colorImages,
  variants,
}: {
  productName: string;
  productSlug: string;
  description: string;
  categoryName: string;
  fallbackImages: string[];
  colorImages: Record<string, string[]>;
  variants: Variant[];
}) {
  const colors = [...new Set(variants.map((v) => v.color))];
  const [color, setColor] = useState(colors[0]);

  const images = colorImages[color]?.length ? colorImages[color] : fallbackImages;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-28 sm:px-10 lg:grid-cols-2 lg:gap-20">
      <Reveal className="grid grid-cols-1 gap-4">
        {images.map((image, i) => (
          <div
            key={image}
            className="relative aspect-[3/4] overflow-hidden bg-surface"
          >
            <Image
              src={image}
              alt={`${productName} — ${color} — view ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.1} className="lg:sticky lg:top-32 lg:self-start">
        <div className="flex items-start justify-between gap-4">
          <p className="eyebrow text-xs text-gold">{categoryName}</p>
          <WishlistButton
            productSlug={productSlug}
            name={productName}
            image={images[0] ?? ""}
            price={variants[0]?.price ?? 0}
            className="text-ivory/70 transition-colors hover:text-gold"
          />
        </div>
        <h1 className="mt-3 font-display text-4xl font-light text-ivory sm:text-5xl">
          {productName}
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-taupe">
          {description}
        </p>

        <div className="mt-10 max-w-sm">
          <VariantSelector
            productName={productName}
            productSlug={productSlug}
            image={images[0] ?? ""}
            variants={variants}
            color={color}
            onColorChange={setColor}
          />
        </div>
      </Reveal>
    </div>
  );
}

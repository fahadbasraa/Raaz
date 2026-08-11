"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  image: string;
  categoryName: string;
  minPrice: number;
  maxPrice: number;
};

export function CollectionGridClient({
  products,
}: {
  products: ProductSummary[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.categoryName))].sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = q.length === 0 || p.name.toLowerCase().includes(q);
      const matchesCategory = !category || p.categoryName === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <>
      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={category === null}
            className={`eyebrow border px-4 py-2 text-[11px] transition-colors ${
              category === null
                ? "border-gold text-gold"
                : "border-ivory/25 text-ivory/70 hover:border-ivory/60"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`eyebrow border px-4 py-2 text-[11px] transition-colors ${
                category === c
                  ? "border-gold text-gold"
                  : "border-ivory/25 text-ivory/70 hover:border-ivory/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the collection"
          aria-label="Search the collection"
          className="w-full max-w-xs border-b border-ivory/25 bg-transparent py-2 text-sm text-ivory placeholder:text-taupe focus:border-gold focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-sm text-taupe">
          Nothing matches — try a different search or color.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.06}>
              <ProductCard
                slug={product.slug}
                name={product.name}
                image={product.image}
                categoryName={product.categoryName}
                minPrice={product.minPrice}
                maxPrice={product.maxPrice}
              />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}

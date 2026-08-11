import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export async function RelatedProducts({
  categoryId,
  excludeProductId,
}: {
  categoryId: string;
  excludeProductId: string;
}) {
  const products = await prisma.product.findMany({
    where: {
      published: true,
      categoryId,
      id: { not: excludeProductId },
    },
    include: { category: true, variants: true },
    take: 4,
    orderBy: { createdAt: "asc" },
  });

  if (products.length === 0) return null;

  return (
    <section className="border-t border-ivory/10 px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow text-xs text-gold">You may also like</p>
          <h2 className="mt-3 font-display text-3xl font-light text-ivory">
            Kept in the same quiet
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => {
            const prices = product.variants.map((v) => v.price);
            const minPrice = prices.length
              ? Math.min(...prices)
              : product.basePrice;
            const maxPrice = prices.length
              ? Math.max(...prices)
              : product.basePrice;

            return (
              <Reveal key={product.id} delay={(i % 4) * 0.08}>
                <ProductCard
                  slug={product.slug}
                  name={product.name}
                  image={product.images[0] ?? ""}
                  categoryName={product.category.name}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

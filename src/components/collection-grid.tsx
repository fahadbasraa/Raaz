import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export async function CollectionGrid() {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: { category: true, variants: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <section id="collection" className="bg-base px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow text-xs text-gold">The collection</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl font-light text-ivory sm:text-5xl">
            Nothing announced.{" "}
            <span className="italic text-taupe">Everything considered.</span>
          </h2>
        </Reveal>

        {products.length === 0 ? (
          <p className="mt-16 text-sm text-taupe">
            The atelier is between collections. Nothing is published yet.
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
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
        )}
      </div>
    </section>
  );
}

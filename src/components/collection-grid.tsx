import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";
import { CollectionGridClient } from "@/components/collection-grid-client";

export async function CollectionGrid() {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: { category: true, variants: true },
    orderBy: { createdAt: "asc" },
  });

  const summaries = products.map((product) => {
    const prices = product.variants.map((v) => v.price);
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      categoryName: product.category.name,
      minPrice: prices.length ? Math.min(...prices) : product.basePrice,
      maxPrice: prices.length ? Math.max(...prices) : product.basePrice,
    };
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

        {summaries.length === 0 ? (
          <p className="mt-16 text-sm text-taupe">
            The atelier is between collections. Nothing is published yet.
          </p>
        ) : (
          <CollectionGridClient products={summaries} />
        )}
      </div>
    </section>
  );
}

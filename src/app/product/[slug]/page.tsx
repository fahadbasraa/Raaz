import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { VariantSelector } from "@/components/variant-selector";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, published: true },
    include: { category: true, variants: { orderBy: { size: "asc" } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} — RAAZ`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <Nav />
      <main className="flex-1 pt-28 sm:pt-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-28 sm:px-10 lg:grid-cols-2 lg:gap-20">
          <Reveal className="grid grid-cols-1 gap-4">
            {product.images.map((image, i) => (
              <div
                key={image}
                className="relative aspect-[3/4] overflow-hidden bg-surface"
              >
                <Image
                  src={image}
                  alt={`${product.name} — view ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-xs text-gold">{product.category.name}</p>
            <h1 className="mt-3 font-display text-4xl font-light text-ivory sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-taupe">
              {product.description}
            </p>

            <div className="mt-10 max-w-sm">
              <VariantSelector
                productName={product.name}
                productSlug={product.slug}
                image={product.images[0] ?? ""}
                variants={product.variants.map((v) => ({
                  id: v.id,
                  size: v.size,
                  color: v.color,
                  price: v.price,
                  stock: v.stock,
                }))}
              />
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProductView } from "@/components/product-view";

export const dynamic = "force-dynamic";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "One Size"];

function bySizeThenColor(
  a: { color: string; size: string },
  b: { color: string; size: string },
) {
  if (a.color !== b.color) return a.color.localeCompare(b.color);
  const rankA = SIZE_ORDER.indexOf(a.size);
  const rankB = SIZE_ORDER.indexOf(b.size);
  if (rankA !== -1 && rankB !== -1) return rankA - rankB;
  return a.size.localeCompare(b.size);
}

async function getProduct(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, published: true },
    include: { category: true, variants: true },
  });
  product?.variants.sort(bySizeThenColor);
  return product;
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
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
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

  const colorImages = (product.colorImages ?? {}) as Record<string, string[]>;

  return (
    <>
      <Nav />
      <main className="flex-1 pt-28 sm:pt-32">
        <ProductView
          productName={product.name}
          productSlug={product.slug}
          description={product.description}
          categoryName={product.category.name}
          fallbackImages={product.images}
          colorImages={colorImages}
          variants={product.variants.map((v) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            price: v.price,
            stock: v.stock,
          }))}
        />
      </main>
      <Footer />
    </>
  );
}

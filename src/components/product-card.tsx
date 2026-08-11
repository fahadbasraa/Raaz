import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { WishlistButton } from "@/components/wishlist-button";

export function ProductCard({
  slug,
  name,
  image,
  categoryName,
  minPrice,
  maxPrice,
}: {
  slug: string;
  name: string;
  image: string;
  categoryName: string;
  minPrice: number;
  maxPrice: number;
}) {
  const priceLabel =
    minPrice === maxPrice
      ? formatPrice(minPrice)
      : `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <WishlistButton
          productSlug={slug}
          name={name}
          image={image}
          price={minPrice}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-base/50 text-ivory backdrop-blur-sm transition-colors hover:text-gold"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-[11px] text-taupe">{categoryName}</p>
          <h3 className="mt-1 font-display text-lg text-ivory">{name}</h3>
        </div>
        <p className="whitespace-nowrap text-sm text-taupe">{priceLabel}</p>
      </div>
    </Link>
  );
}

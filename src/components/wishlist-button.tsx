"use client";

import { motion } from "framer-motion";
import { useWishlistStore } from "@/store/wishlist";

export function WishlistButton({
  productSlug,
  name,
  image,
  price,
  className,
}: {
  productSlug: string;
  name: string;
  image: string;
  price: number;
  className?: string;
}) {
  const saved = useWishlistStore((s) => s.has(productSlug));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ productSlug, name, image, price });
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={className}
    >
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        initial={false}
        animate={{ scale: saved ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <path
          d="M12 20.5s-7.5-4.6-10-9.3C.4 7.8 2 4 5.6 4c2 0 3.6 1.2 4.4 2.8C10.8 5.2 12.4 4 14.4 4 18 4 19.6 7.8 18 11.2c-2.5 4.7-10 9.3-10 9.3Z"
          fill={saved ? "var(--color-gold)" : "none"}
          stroke={saved ? "var(--color-gold)" : "currentColor"}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </motion.svg>
    </button>
  );
}

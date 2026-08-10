import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SIZES = ["XS", "S", "M", "L", "XL"];

type ProductSeed = {
  name: string;
  slug: string;
  description: string;
  category: { name: string; slug: string };
  basePrice: number;
  images: string[];
  colors: string[];
  sizes: string[];
  skuPrefix: string;
};

const products: ProductSeed[] = [
  {
    name: "The Second Skin Coat",
    slug: "the-second-skin-coat",
    description:
      "A double-faced wool coat cut for stillness. Hand-finished seams, no lining to hide behind — the inside is as considered as the outside.",
    category: { name: "Outerwear", slug: "outerwear" },
    basePrice: 128000,
    images: [
      "https://images.unsplash.com/photo-1683642765591-2370edc15193?w=1600&q=80&auto=format",
      "https://images.unsplash.com/photo-1683642766177-8ae7c4be03cb?w=1600&q=80&auto=format",
    ],
    colors: ["Black", "Moss"],
    sizes: SIZES,
    skuPrefix: "RZ-COAT",
  },
  {
    name: "Low Light Blazer",
    slug: "low-light-blazer",
    description:
      "Unstructured tailoring in a heavyweight twill. Built to move like it isn't there, until the room notices it is.",
    category: { name: "Tailoring", slug: "tailoring" },
    basePrice: 98000,
    images: [
      "https://images.unsplash.com/photo-1677246791501-85875b1ab187?w=1600&q=80&auto=format",
      "https://images.unsplash.com/photo-1628479519046-60cb0708aab1?w=1600&q=80&auto=format",
    ],
    colors: ["Black", "Ink"],
    sizes: SIZES,
    skuPrefix: "RZ-BLZR",
  },
  {
    name: "Quiet Hour Trousers",
    slug: "quiet-hour-trousers",
    description:
      "A tapered leg in washed wool gabardine. Deep pockets, hidden hem — made to disappear into every silhouette you own.",
    category: { name: "Tailoring", slug: "tailoring" },
    basePrice: 48000,
    images: [
      "https://images.unsplash.com/photo-1764698072732-ea0230fc5d8e?w=1600&q=80&auto=format",
      "https://images.unsplash.com/photo-1743097765313-f4b05d74a873?w=1600&q=80&auto=format",
    ],
    colors: ["Charcoal", "Taupe"],
    sizes: SIZES,
    skuPrefix: "RZ-TRSR",
  },
  {
    name: "Held Breath Knit",
    slug: "held-breath-knit",
    description:
      "Fine-gauge merino, hand-linked at every seam. Worn close, it holds warmth the way a secret holds weight.",
    category: { name: "Knitwear", slug: "knitwear" },
    basePrice: 42000,
    images: [
      "https://images.unsplash.com/photo-1612448577389-af63ae7e55bd?w=1600&q=80&auto=format",
      "https://images.unsplash.com/photo-1611691798604-2d2c77ec024c?w=1600&q=80&auto=format",
    ],
    colors: ["Ivory", "Emerald"],
    sizes: SIZES,
    skuPrefix: "RZ-KNIT",
  },
  {
    name: "Night Walk Shirt",
    slug: "night-walk-shirt",
    description:
      "Washed silk-cotton with a soft, undone collar. The kind of shirt that looks better the longer you've had it.",
    category: { name: "Tailoring", slug: "tailoring" },
    basePrice: 36000,
    images: [
      "https://images.unsplash.com/photo-1718278867451-0af1bcb0dfc5?w=1600&q=80&auto=format",
      "https://images.unsplash.com/photo-1756887267535-6e25b59fe9c6?w=1600&q=80&auto=format",
    ],
    colors: ["Black", "Bone"],
    sizes: SIZES,
    skuPrefix: "RZ-SHRT",
  },
  {
    name: "Unspoken Overshirt",
    slug: "unspoken-overshirt",
    description:
      "A heavyweight cotton twill layer between shirt and jacket. One patch pocket, corozo buttons, nothing announced.",
    category: { name: "Outerwear", slug: "outerwear" },
    basePrice: 54000,
    images: [
      "https://images.unsplash.com/photo-1525428419170-426069658049?w=1600&q=80&auto=format",
      "https://images.unsplash.com/photo-1596654581115-8059f03c8b4e?w=1600&q=80&auto=format",
    ],
    colors: ["Olive", "Black"],
    sizes: SIZES,
    skuPrefix: "RZ-OVSH",
  },
  {
    name: "Loose Thread Scarf",
    slug: "loose-thread-scarf",
    description:
      "Oversized alpaca-wool scarf, fringed by hand. The one piece meant to be worn until it frays.",
    category: { name: "Accessories", slug: "accessories" },
    basePrice: 18000,
    images: [
      "https://images.unsplash.com/photo-1644269444230-c6d1f2722e10?w=1600&q=80&auto=format",
      "https://images.unsplash.com/photo-1543811421-215d504c36f3?w=1600&q=80&auto=format",
    ],
    colors: ["Charcoal"],
    sizes: ["One Size"],
    skuPrefix: "RZ-SCRF",
  },
];

async function main() {
  for (const p of products) {
    const category = await prisma.category.upsert({
      where: { slug: p.category.slug },
      update: {},
      create: p.category,
    });

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        basePrice: p.basePrice,
        images: p.images,
        published: true,
        categoryId: category.id,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        images: p.images,
        published: true,
        categoryId: category.id,
      },
    });

    for (const color of p.colors) {
      for (const size of p.sizes) {
        const sku = `${p.skuPrefix}-${color.slice(0, 3).toUpperCase()}-${size}`;
        await prisma.variant.upsert({
          where: { sku },
          update: { price: p.basePrice, stock: 12 },
          create: {
            productId: product.id,
            size,
            color,
            sku,
            price: p.basePrice,
            stock: 12,
          },
        });
      }
    }
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

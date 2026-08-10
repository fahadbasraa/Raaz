import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-light">Products</h1>
        <Link
          href="/admin/products/new"
          className="eyebrow border border-ivory/40 px-5 py-3 text-xs hover:border-gold hover:text-gold"
        >
          New product
        </Link>
      </div>

      <table className="mt-10 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="eyebrow border-b border-ivory/10 text-[11px] text-taupe">
            <th className="py-3 font-normal">Name</th>
            <th className="py-3 font-normal">Category</th>
            <th className="py-3 font-normal">Price</th>
            <th className="py-3 font-normal">Stock</th>
            <th className="py-3 font-normal">Status</th>
            <th className="py-3 font-normal" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
            return (
              <tr key={product.id} className="border-b border-ivory/10">
                <td className="py-4 text-ivory">{product.name}</td>
                <td className="py-4 text-taupe">{product.category.name}</td>
                <td className="py-4 text-taupe">{formatPrice(product.basePrice)}</td>
                <td className="py-4 text-taupe">{totalStock}</td>
                <td className="py-4">
                  <span
                    className={`eyebrow text-[10px] ${
                      product.published ? "text-gold" : "text-taupe"
                    }`}
                  >
                    {product.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-xs text-taupe hover:text-gold"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

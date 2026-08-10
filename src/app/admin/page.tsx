import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [productCount, pendingOrders, lowStock, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count({ where: { status: "paid" } }),
      prisma.variant.findMany({
        where: { stock: { lte: 3 } },
        include: { product: true },
        orderBy: { stock: "asc" },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
    ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-light">Dashboard</h1>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard label="Products" value={productCount} />
        <StatCard label="Orders to fulfill" value={pendingOrders} />
        <StatCard label="Low stock variants" value={lowStock.length} />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <p className="eyebrow text-xs text-taupe">Recent orders</p>
            <Link href="/admin/orders" className="text-xs text-taupe hover:text-gold">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-ivory/10 border-t border-ivory/10">
            {recentOrders.length === 0 && (
              <li className="py-4 text-sm text-taupe">No orders yet.</li>
            )}
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between py-4">
                <div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-sm text-ivory hover:text-gold"
                  >
                    #{order.id.slice(-8).toUpperCase()}
                  </Link>
                  <p className="mt-1 text-xs text-taupe">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-ivory">{formatPrice(order.total)}</p>
                  <p className="eyebrow mt-1 text-[10px] text-taupe">{order.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="eyebrow text-xs text-taupe">Low stock</p>
            <Link href="/admin/products" className="text-xs text-taupe hover:text-gold">
              View all products
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-ivory/10 border-t border-ivory/10">
            {lowStock.length === 0 && (
              <li className="py-4 text-sm text-taupe">Nothing running low.</li>
            )}
            {lowStock.map((variant) => (
              <li key={variant.id} className="flex items-center justify-between py-4">
                <div>
                  <Link
                    href={`/admin/products/${variant.productId}/edit`}
                    className="text-sm text-ivory hover:text-gold"
                  >
                    {variant.product.name}
                  </Link>
                  <p className="mt-1 text-xs text-taupe">
                    {variant.color} — {variant.size}
                  </p>
                </div>
                <p className="text-sm text-gold">{variant.stock} left</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ivory/10 p-6">
      <p className="eyebrow text-xs text-taupe">{label}</p>
      <p className="mt-3 font-display text-4xl font-light">{value}</p>
    </div>
  );
}

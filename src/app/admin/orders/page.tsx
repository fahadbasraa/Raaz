import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-light">Orders</h1>

      <table className="mt-10 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="eyebrow border-b border-ivory/10 text-[11px] text-taupe">
            <th className="py-3 font-normal">Order</th>
            <th className="py-3 font-normal">Customer</th>
            <th className="py-3 font-normal">Items</th>
            <th className="py-3 font-normal">Total</th>
            <th className="py-3 font-normal">Status</th>
            <th className="py-3 font-normal">Placed</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-taupe">
                No orders yet.
              </td>
            </tr>
          )}
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-ivory/10">
              <td className="py-4">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-ivory hover:text-gold"
                >
                  #{order.id.slice(-8).toUpperCase()}
                </Link>
              </td>
              <td className="py-4 text-taupe">{order.email}</td>
              <td className="py-4 text-taupe">{order.items.length}</td>
              <td className="py-4 text-taupe">{formatPrice(order.total)}</td>
              <td className="py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="py-4 text-taupe">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "paid"
      ? "text-gold"
      : status === "fulfilled"
        ? "text-ivory"
        : status === "cancelled"
          ? "text-red-400"
          : "text-taupe";
  return <span className={`eyebrow text-[10px] ${color}`}>{status}</span>;
}

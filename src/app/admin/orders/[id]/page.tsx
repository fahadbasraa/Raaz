import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { updateOrderStatus } from "@/app/actions/admin-orders";

const STATUSES = ["pending", "paid", "fulfilled", "cancelled"] as const;

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });
  if (!order) notFound();

  const shippingAddress = order.shippingAddress as {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;

  return (
    <div>
      <p className="eyebrow text-xs text-taupe">
        Order #{order.id.slice(-8).toUpperCase()}
      </p>
      <h1 className="mt-2 font-display text-3xl font-light">{order.email}</h1>

      <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="eyebrow text-xs text-taupe">Items</p>
          <ul className="mt-4 divide-y divide-ivory/10 border-t border-ivory/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-4 text-sm">
                <span className="text-ivory">
                  {item.nameSnapshot} × {item.quantity}
                </span>
                <span className="text-taupe">
                  {formatPrice(item.priceSnapshot * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-ivory/10 pt-4 text-sm">
            <span className="text-ivory">Total</span>
            <span className="text-ivory">{formatPrice(order.total)}</span>
          </div>

          {shippingAddress && (
            <div className="mt-12">
              <p className="eyebrow text-xs text-taupe">Shipping address</p>
              <p className="mt-4 text-sm leading-relaxed text-ivory">
                {shippingAddress.name}
                <br />
                {shippingAddress.line1}
                {shippingAddress.line2 && (
                  <>
                    <br />
                    {shippingAddress.line2}
                  </>
                )}
                <br />
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postalCode}
                <br />
                {shippingAddress.country}
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow text-xs text-taupe">Status</p>
          <form action={updateOrderStatus} className="mt-4 flex flex-col gap-4">
            <input type="hidden" name="id" value={order.id} />
            <select
              name="status"
              defaultValue={order.status}
              className="border border-ivory/20 bg-base px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="eyebrow w-fit border border-ivory/40 px-6 py-2.5 text-xs hover:border-gold hover:text-gold"
            >
              Update status
            </button>
          </form>

          <p className="eyebrow mt-10 text-xs text-taupe">Payment</p>
          <p className="mt-3 break-all text-xs text-taupe">
            {order.stripePaymentIntentId ?? "No payment intent yet"}
          </p>
        </div>
      </div>
    </div>
  );
}

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { formatPrice } from "@/lib/format";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { orderId } = await searchParams;
  if (!orderId) notFound();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { items: true },
  });
  if (!order) notFound();

  const confirmed = order.status === "paid" || order.status === "fulfilled";

  return (
    <>
      <ClearCartOnMount />
      <Nav />
      <main className="flex-1 px-6 pt-32 pb-28 sm:px-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow text-xs text-gold">
            {confirmed ? "Confirmed" : "Reviewing your payment"}
          </p>
          <h1 className="mt-3 font-display text-4xl font-light text-ivory">
            {confirmed ? "Kept." : "Almost kept."}
          </h1>
          <p className="mt-4 text-sm text-taupe">
            {confirmed
              ? "Your order has been received. A confirmation is on its way to " +
                order.email +
                "."
              : "We're confirming your payment now — this page will update shortly. No need to try again."}
          </p>

          <div className="mt-12 border-t border-ivory/10 pt-8 text-left">
            <p className="eyebrow text-xs text-taupe">
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
            <ul className="mt-6 divide-y divide-ivory/10">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
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
          </div>

          <Link
            href="/#collection"
            className="eyebrow mt-12 inline-block border-b border-ivory/40 pb-1 text-xs text-ivory transition-colors hover:border-gold hover:text-gold"
          >
            Continue browsing
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

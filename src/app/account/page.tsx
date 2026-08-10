import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SignOutButton } from "@/components/sign-out-button";
import { formatPrice } from "@/lib/format";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <>
      <Nav />
      <main className="flex-1 px-6 pt-32 pb-28 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="eyebrow text-xs text-gold">Account</p>
              <h1 className="mt-3 font-display text-3xl font-light text-ivory">
                {session.user.name ?? session.user.email}
              </h1>
            </div>
            <SignOutButton />
          </div>

          <div className="mt-14">
            <p className="eyebrow text-xs text-taupe">Order history</p>

            {orders.length === 0 ? (
              <p className="mt-4 text-sm text-taupe">
                Nothing ordered yet — when it happens, it will be kept here.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-ivory/10 border-t border-ivory/10">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between py-5"
                  >
                    <div>
                      <p className="text-sm text-ivory">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-taupe">
                        {order.items.length} item
                        {order.items.length === 1 ? "" : "s"} —{" "}
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-ivory">
                        {formatPrice(order.total)}
                      </p>
                      <p className="eyebrow mt-1 text-[10px] text-taupe">
                        {order.status}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

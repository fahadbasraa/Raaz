import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CheckoutClient } from "@/components/checkout-client";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

  return (
    <>
      <Nav />
      <main className="flex-1 px-6 pt-32 pb-28 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-xs text-gold">Checkout</p>
          <h1 className="mt-3 font-display text-3xl font-light text-ivory">
            Almost kept
          </h1>

          <CheckoutClient userEmail={session.user.email ?? ""} />
        </div>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 px-6 pt-32 pb-28 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow text-xs text-gold">Terms</p>
          <h1 className="mt-3 font-display text-4xl font-light text-ivory">
            The quiet print
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-taupe">
            Last updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}.
            By ordering from RAAZ, you&apos;re agreeing to the following.
          </p>

          <div className="mt-12 space-y-10">
            <Section title="Orders">
              <p>
                Placing an order is an offer to buy, not a confirmed sale —
                we confirm once payment succeeds and the item is available.
                Every piece is made in small batches; on the rare occasion a
                size or color sells out between browsing and checkout,
                we&apos;ll refund that item and let you know.
              </p>
              <p>
                We reserve the right to refuse or cancel an order, at our
                discretion, in cases of suspected fraud or error in pricing
                or listing.
              </p>
            </Section>

            <Section title="Pricing">
              <p>
                Prices are listed in USD and don&apos;t include shipping or
                tax, which are calculated at checkout. We try to keep prices
                accurate; if something is mispriced due to a technical
                error, we&apos;ll contact you before charging or fulfilling
                the order.
              </p>
            </Section>

            <Section title="Shipping">
              <p>
                Everything is made to order. Expect 2–3 weeks between order
                and shipment, plus transit time, shown at checkout for your
                address. You&apos;ll get a confirmation email once your
                order ships.
              </p>
            </Section>

            <Section title="Returns and exchanges">
              <p>
                See our{" "}
                <Link
                  href="/returns"
                  className="text-ivory underline decoration-ivory/30 underline-offset-2 hover:text-gold"
                >
                  returns policy
                </Link>{" "}
                for the full detail on exchanges, damages, and final sale
                items.
              </p>
            </Section>

            <Section title="Accounts">
              <p>
                You&apos;re responsible for keeping your login credentials
                private and for what happens under your account. Let us
                know immediately if you think it&apos;s been compromised.
              </p>
            </Section>

            <Section title="Intellectual property">
              <p>
                Everything on this site — photography, copy, the RAAZ name
                and mark, garment designs — belongs to RAAZ. None of it may
                be reproduced or reused without written permission.
              </p>
            </Section>

            <Section title="Liability">
              <p>
                RAAZ is provided as-is. We aren&apos;t liable for indirect
                or consequential damages arising from use of the site or a
                purchase, beyond the value of the order itself, except where
                the law doesn&apos;t allow that limitation.
              </p>
            </Section>

            <Section title="Changes">
              <p>
                These terms may be updated as the store evolves. Continuing
                to order after a change means you accept the new terms.
                Questions go to{" "}
                <a
                  href="mailto:hello@raaz.com"
                  className="text-ivory underline decoration-ivory/30 underline-offset-2 hover:text-gold"
                >
                  hello@raaz.com
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-light text-ivory">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-taupe">
        {children}
      </div>
    </div>
  );
}

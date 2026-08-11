import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function ReturnsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 px-6 pt-32 pb-28 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow text-xs text-gold">Returns</p>
          <h1 className="mt-3 font-display text-4xl font-light text-ivory">
            If it doesn&apos;t fit the silence
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-taupe">
            Every piece is made to order, in small batches, by hand — that
            changes how returns work here. We&apos;d rather be upfront about
            it than promise something we can&apos;t honor.
          </p>

          <div className="mt-12 space-y-10">
            <Section title="Exchanges">
              <p>
                Wrong size, changed your mind on color — we&apos;ll exchange
                an unworn piece, tags attached, within 14 days of delivery.
                Email{" "}
                <a
                  href="mailto:hello@raaz.com"
                  className="text-ivory underline decoration-ivory/30 underline-offset-2 hover:text-gold"
                >
                  hello@raaz.com
                </a>{" "}
                with your order number and we&apos;ll walk you through it.
                Since each piece is made to order, an exchange means a new
                one is made — expect the same 2–3 week lead time.
              </p>
            </Section>

            <Section title="Refunds">
              <p>
                Because production starts as soon as an order is placed, we
                don&apos;t offer refunds for change of mind. If what arrives
                is damaged, defective, or not what you ordered, we&apos;ll
                replace it or refund it in full — that one is always on us.
              </p>
            </Section>

            <Section title="Final sale">
              <p>
                Items marked final sale at checkout, and any piece from a
                discontinued or one-off run, can&apos;t be exchanged or
                refunded except for damage or defect.
              </p>
            </Section>

            <Section title="Damaged or incorrect orders">
              <p>
                Email us within 7 days of delivery with a photo of the
                issue. We&apos;ll sort a replacement or refund — no need to
                send anything back first.
              </p>
            </Section>

            <Section title="How to start one">
              <p>
                There&apos;s no self-serve return portal yet — for now, it&apos;s
                a real reply from a real person. Email{" "}
                <a
                  href="mailto:hello@raaz.com"
                  className="text-ivory underline decoration-ivory/30 underline-offset-2 hover:text-gold"
                >
                  hello@raaz.com
                </a>{" "}
                with your order number and what&apos;s going on.
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

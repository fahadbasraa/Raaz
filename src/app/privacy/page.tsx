import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 px-6 pt-32 pb-28 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow text-xs text-gold">Privacy</p>
          <h1 className="mt-3 font-display text-4xl font-light text-ivory">
            What we keep, and what we don&apos;t
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-taupe">
            Last updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}.
            RAAZ collects only what&apos;s needed to take your order, ship it,
            and keep your account working. We don&apos;t sell your
            information, and we don&apos;t share it beyond what&apos;s
            required to run the store.
          </p>

          <div className="mt-12 space-y-10">
            <Section title="What we collect">
              <p>
                When you create an account: your name, email, and a hashed
                password — we never see or store your password in plain
                text.
              </p>
              <p>
                When you order, as a guest or signed in: your email, shipping
                address, and the contents of your order. Payment card
                details are handled entirely by Stripe; RAAZ never sees or
                stores your card number.
              </p>
              <p>
                Basic, anonymized visit analytics (pages viewed, general
                location by region) collected via Vercel Analytics, to
                understand which pages are working and which aren&apos;t.
                This data isn&apos;t tied to your identity.
              </p>
            </Section>

            <Section title="Who we share it with">
              <p>
                Only the processors that make the store function: Stripe for
                payment, our database and hosting providers to run the site,
                and Resend to deliver order confirmation emails. Each is
                bound to use your data only to provide that service — none
                of them are permitted to use it for their own marketing.
              </p>
              <p>We do not sell, rent, or trade your information, ever.</p>
            </Section>

            <Section title="How long we keep it">
              <p>
                Order records are kept indefinitely for accounting and
                warranty purposes. Account data is kept until you ask us to
                delete it. Newsletter subscriptions are kept until you
                unsubscribe.
              </p>
            </Section>

            <Section title="Your rights">
              <p>
                You can ask us to send you a copy of what we hold, correct
                it, or delete your account and associated personal data
                (order history is retained in anonymized form for
                accounting) at any time by emailing{" "}
                <a
                  href="mailto:hello@raaz.com"
                  className="text-ivory underline decoration-ivory/30 underline-offset-2 hover:text-gold"
                >
                  hello@raaz.com
                </a>
                .
              </p>
            </Section>

            <Section title="Cookies">
              <p>
                We use only the cookies required to keep you signed in and
                your bag intact between visits. No third-party advertising
                or tracking cookies are set.
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

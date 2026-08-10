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
            This page is being written alongside the rest of the store.
            RAAZ collects only what&apos;s needed to take your order, ship it,
            and keep you signed in — nothing is sold to third parties. A
            full policy will appear here before checkout goes live.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

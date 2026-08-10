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
            Terms of sale, shipping, and returns will be published here
            before checkout goes live.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

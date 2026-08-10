import Image from "next/image";
import { Reveal } from "@/components/reveal";

export function AtelierStory() {
  return (
    <section
      id="atelier"
      className="bg-surface px-6 py-28 sm:px-10"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal className="relative aspect-[4/5] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80&auto=format"
            alt="A garment in progress on a worktable in the RAAZ atelier"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow text-xs text-gold">The atelier</p>
          <h2 className="mt-3 font-display text-4xl font-light leading-tight text-ivory sm:text-5xl">
            Every piece keeps <span className="italic">a secret</span> —
            the hours it took to make it look effortless.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-taupe">
            RAAZ means secret. We work in small batches, by hand, with people
            who have spent decades learning what a seam can hold. Nothing
            leaves the atelier until it earns its quiet.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const WORDS = ["Made slowly", "In small numbers", "راز", "Kept quiet, worn loudly"];

export function Marquee() {
  const track = [...WORDS, ...WORDS];

  return (
    <div
      className="overflow-hidden border-y border-ivory/10 bg-surface py-6"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max gap-16">
        {[...track, ...track].map((word, i) => (
          <span
            key={i}
            className="font-display text-2xl italic text-taupe whitespace-nowrap"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

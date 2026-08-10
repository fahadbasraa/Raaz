"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/app/actions/newsletter";
import { Reveal } from "@/components/reveal";

const initialState: NewsletterState = { status: "idle", message: "" };

export function Newsletter() {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialState,
  );

  return (
    <section className="bg-base px-6 py-28 sm:px-10">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="eyebrow text-xs text-gold">Stay unannounced</p>
        <h2 className="mt-3 font-display text-3xl font-light text-ivory sm:text-4xl">
          Hear about it before it&apos;s <span className="italic">gone</span>.
        </h2>
        <p className="mt-4 text-sm text-taupe">
          No noise, no discounts — just word when a new piece is ready.
        </p>

        <form
          action={formAction}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="w-full max-w-xs border-b border-ivory/30 bg-transparent px-1 py-2 text-sm text-ivory placeholder:text-taupe/60 focus:border-gold focus:outline-none sm:w-72"
          />
          <button
            type="submit"
            disabled={pending}
            className="eyebrow shrink-0 border-b border-ivory/40 pb-1 text-xs text-ivory transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
          >
            {pending ? "Sending…" : "Join the list"}
          </button>
        </form>

        <p
          role="status"
          aria-live="polite"
          className={`mt-4 text-xs ${
            state.status === "error" ? "text-red-400" : "text-taupe"
          }`}
        >
          {state.message}
        </p>
      </Reveal>
    </section>
  );
}

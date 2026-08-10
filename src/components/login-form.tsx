"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("That email and password don't match.");
      setPending(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="eyebrow text-[11px] text-taupe">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="eyebrow text-[11px] text-taupe">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory focus:border-gold focus:outline-none"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="eyebrow mt-2 w-full border border-ivory/40 py-4 text-xs text-ivory transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

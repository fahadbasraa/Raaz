"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerAction } from "@/app/actions/auth";
import { authInitialState } from "@/lib/auth-state";

export function RegisterForm() {
  const router = useRouter();
  const signedInRef = useRef(false);
  const credentialsRef = useRef({ email: "", password: "" });
  const [state, formAction, pending] = useActionState(
    registerAction,
    authInitialState,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (state.status !== "success" || signedInRef.current) return;
    signedInRef.current = true;

    const { email, password } = credentialsRef.current;
    signIn("credentials", { email, password, redirect: false }).then(() => {
      router.push("/account");
      router.refresh();
    });
  }, [state.status, router]);

  return (
    <form
      action={(formData) => {
        credentialsRef.current = { email, password };
        formAction(formData);
      }}
      className="mt-8 flex flex-col gap-5"
    >
      <div>
        <label htmlFor="name" className="eyebrow text-[11px] text-taupe">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory focus:border-gold focus:outline-none"
        />
      </div>

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border-b border-ivory/30 bg-transparent py-2 text-sm text-ivory focus:border-gold focus:outline-none"
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-xs text-red-400">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="eyebrow mt-2 w-full border border-ivory/40 py-4 text-xs text-ivory transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

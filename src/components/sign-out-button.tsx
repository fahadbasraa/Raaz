"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="eyebrow text-xs text-taupe transition-colors hover:text-gold"
    >
      Sign out
    </button>
  );
}

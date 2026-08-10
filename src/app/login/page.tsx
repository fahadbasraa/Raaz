import { Suspense } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 px-6 pt-32 pb-28 sm:px-10">
        <div className="mx-auto max-w-sm">
          <p className="eyebrow text-xs text-gold">Welcome back</p>
          <h1 className="mt-3 font-display text-3xl font-light text-ivory">
            Sign in
          </h1>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>

          <p className="mt-8 text-center text-sm text-taupe">
            New to RAAZ?{" "}
            <Link href="/register" className="text-ivory hover:text-gold">
              Create an account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

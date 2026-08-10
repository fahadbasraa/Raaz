import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 px-6 pt-32 pb-28 sm:px-10">
        <div className="mx-auto max-w-sm">
          <p className="eyebrow text-xs text-gold">Join RAAZ</p>
          <h1 className="mt-3 font-display text-3xl font-light text-ivory">
            Keep an account
          </h1>
          <p className="mt-3 text-sm text-taupe">
            For order history and a faster return. Nothing else.
          </p>

          <RegisterForm />

          <p className="mt-8 text-center text-sm text-taupe">
            Already have an account?{" "}
            <Link href="/login" className="text-ivory hover:text-gold">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

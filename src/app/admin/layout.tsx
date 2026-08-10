import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-base text-ivory">
      <header className="border-b border-ivory/10 px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/admin" className="font-display text-xl italic">
              RAAZ <span className="text-taupe">Admin</span>
            </Link>
            <nav className="eyebrow flex gap-6 text-xs text-ivory/70">
              <Link href="/admin" className="hover:text-gold">
                Dashboard
              </Link>
              <Link href="/admin/products" className="hover:text-gold">
                Products
              </Link>
              <Link href="/admin/orders" className="hover:text-gold">
                Orders
              </Link>
            </nav>
          </div>
          <div className="eyebrow flex items-center gap-6 text-xs text-taupe">
            <span>{admin.name ?? admin.email}</span>
            <Link href="/" className="hover:text-gold">
              View store
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">{children}</main>
    </div>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-surface px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-2xl italic text-ivory">RAAZ</p>
            <p className="mt-3 max-w-[22ch] text-xs leading-relaxed text-taupe">
              راز — secret. Kept quiet, worn loudly.
            </p>
          </div>

          <div>
            <p className="eyebrow text-[11px] text-taupe">Shop</p>
            <ul className="mt-4 space-y-3 text-sm text-ivory/80">
              <li>
                <a href="#collection" className="transition-colors hover:text-gold">
                  Collection
                </a>
              </li>
              <li>
                <a href="#atelier" className="transition-colors hover:text-gold">
                  Atelier
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-[11px] text-taupe">Account</p>
            <ul className="mt-4 space-y-3 text-sm text-ivory/80">
              <li>
                <Link href="/account" className="transition-colors hover:text-gold">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition-colors hover:text-gold">
                  Bag
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-[11px] text-taupe">Legal</p>
            <ul className="mt-4 space-y-3 text-sm text-ivory/80">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-gold">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-gold">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ivory/10 pt-8 text-xs text-taupe sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} RAAZ. All rights reserved.</p>
          <p className="eyebrow text-[10px]">Made slowly, in small numbers</p>
        </div>
      </div>
    </footer>
  );
}

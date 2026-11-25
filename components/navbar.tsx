import Link from 'next/link';

/** The site bar: the same mat-navy as each tournament's header, which sits right under it. */
export default function Navbar() {
  return (
    <header className="bg-mat text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-2xl font-semibold tracking-tight">
          {/* A wrestling mat's centre circle. */}
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <circle cx="11" cy="11" r="9.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="11" cy="11" r="3.5" fill="#D3313C" />
          </svg>
          OpenTW
        </Link>
        <nav>
          <Link href="/tournaments" className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">
            Find a tournament
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ma-charcoal shadow-sm transition-transform group-hover:scale-[1.03]">
            <Image
              src="/ma-icon.png"
              alt="Mad Apple Softball"
              width={40}
              height={40}
              className="h-7 w-auto"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight text-ma-charcoal">
              Mad Apple{" "}
              <span className="text-ma-red">Softball</span>
            </div>
            <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              2025 – 2026 Season
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="px-3 py-2 rounded-md text-muted-foreground hover:text-ma-charcoal hover:bg-secondary/60 transition-colors"
          >
            Teams
          </Link>
          <a
            href="https://madapplesoftball.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-md text-muted-foreground hover:text-ma-charcoal hover:bg-secondary/60 transition-colors inline-flex items-center gap-1.5"
          >
            Main Site
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </nav>
      </div>
      <div className="h-[3px] bg-gradient-to-r from-ma-red via-ma-red to-ma-charcoal" />
    </header>
  );
}

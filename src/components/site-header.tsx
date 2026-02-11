import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="border-b border-border/40 bg-ma-charcoal">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/ma-logo.png"
            alt="Mad Apple Sports Performance"
            width={120}
            height={100}
            className="h-10 w-auto"
            priority
          />
          <div>
            <h1 className="text-lg font-bold leading-none tracking-wide text-white">
              MAD APPLE
            </h1>
            <p className="text-xs tracking-widest text-ma-grey uppercase">
              Sports Performance
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

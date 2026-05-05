import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mad Apple Softball | 2025-2026 Rosters",
  description:
    "Official team rosters for Mad Apple Softball. View players, positions, and class years across all age groups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 lg:py-12">
          {children}
        </main>
        <footer className="border-t border-border/60 mt-16">
          <div className="container mx-auto px-4 py-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
            <span>© Mad Apple Softball · 2025–2026 Season</span>
            <span className="tabular-nums">Rosters powered by Airtable</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, Manrope, Cinzel, Playfair_Display, Lobster } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-finale" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-playfair" });
const lobster = Lobster({ subsets: ["latin"], weight: ["400"], variable: "--font-lobster" });

export const metadata: Metadata = {
  title: "31st Night Party",
  description: "MIT-A Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable} ${cinzel.variable} ${playfair.variable} ${lobster.variable} bg-gray-50 text-gray-900`}>
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <Image src="/logo.jpeg" width={60} height={60} alt="logo" className="rounded-full" />
            </a>
            <div className="flex items-center gap-3 text-sm">
              <a href="/party31/register" className="px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition">Register</a>
            </div>
          </div>
        </header>

        <main>{children}</main>

        
      </body>
    </html>
  );
}

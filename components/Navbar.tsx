"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Start" },
  { href: "/ogloszenia", label: "Ogłoszenia" },
  { href: "/dodaj", label: "Dodaj" },
  { href: "/moje-rezerwacje", label: "Moje rezerwacje" },
  { href: "/moje-ogloszenia", label: "Moje ogłoszenia" },
  { href: "/wiadomosci", label: "Wiadomości" },
  { href: "/profil", label: "Profil" },
  { href: "/bezpieczenstwo", label: "Bezpieczeństwo" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-brand-900">
          <span className="text-xl" aria-hidden>
            ✈️
          </span>
          <span className="text-lg tracking-tight">Nalotini</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-800"
                    : "text-slate-600 hover:text-brand-800 hover:bg-brand-50/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/dodaj" className="btn-primary !py-1.5 !px-3 text-xs lg:hidden">
          + Dodaj
        </Link>
      </div>
    </header>
  );
}

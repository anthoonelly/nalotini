"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
        pathname === href
          ? "text-brand-900 bg-brand-50"
          : "text-slate-600 hover:text-brand-900 hover:bg-brand-50/60"
      }`}
      onClick={() => setMenuOpen(false)}
    >
      {label}
    </Link>
  );

  const isAdmin = session?.user.role === "admin";

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-900">
          <span className="text-xl">🛩️</span>
          <span>Nalotini</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLink("/", "Start")}
          {navLink("/ogloszenia", "Ogłoszenia")}
          {session && navLink("/dodaj", "Dodaj")}
          {session && navLink("/moje-ogloszenia", "Moje ogłoszenia")}
          {session && navLink("/moje-rezerwacje", "Moje rezerwacje")}
          {session && navLink("/wiadomosci", "Wiadomości")}
          {navLink("/bezpieczenstwo", "Bezpieczeństwo")}
          {isAdmin && navLink("/admin", "Admin")}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link
                href="/profil"
                className="hidden lg:flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-brand-50"
              >
                <Avatar name={session.user.name || "?"} size="sm" />
                <span className="text-sm font-medium text-slate-700">
                  {session.user.name?.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden lg:inline-block btn btn-ghost text-sm"
              >
                Wyloguj
              </button>
              <Link
                href="/dodaj"
                className="lg:hidden btn btn-primary text-sm"
              >
                + Dodaj
              </Link>
            </>
          ) : (
            <>
              <Link href="/logowanie" className="btn btn-ghost text-sm">
                Zaloguj
              </Link>
              <Link href="/rejestracja" className="btn btn-primary text-sm">
                Załóż konto
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

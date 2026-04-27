"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { useNotifications } from "./useNotifications";

function Badge({ count }: { count: number }) {
  if (!count || count <= 0) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold leading-none">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { unreadMessages, pendingReservations } = useNotifications();

  const navLink = (href: string, label: string, badge?: number) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center ${
        pathname === href
          ? "text-brand-900 bg-brand-50"
          : "text-slate-600 hover:text-brand-900 hover:bg-brand-50/60"
      }`}
    >
      {label}
      {badge !== undefined && <Badge count={badge} />}
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
          {session && navLink("/moje-ogloszenia", "Moje ogłoszenia", pendingReservations)}
          {session && navLink("/moje-rezerwacje", "Moje rezerwacje")}
          {session && navLink("/wiadomosci", "Wiadomości", unreadMessages)}
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
              <Link href="/dodaj" className="lg:hidden btn btn-primary text-sm">
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

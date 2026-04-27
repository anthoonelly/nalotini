"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Icon = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  list: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  plus: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  chat: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  ),
  user: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const item = (
    href: string,
    label: string,
    icon: React.ReactNode,
    primary = false
  ) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 ${
          primary
            ? "text-white"
            : active
            ? "text-brand-900"
            : "text-slate-500"
        }`}
      >
        <span
          className={
            primary
              ? "h-12 w-12 rounded-full bg-brand-700 shadow-lg flex items-center justify-center -mt-7"
              : ""
          }
        >
          {icon}
        </span>
        <span
          className={`text-[10px] font-medium ${primary ? "text-brand-700 mt-1" : ""}`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200">
      <div className="flex items-end px-1 pb-[env(safe-area-inset-bottom)]">
        {item("/", "Start", Icon.home)}
        {item("/ogloszenia", "Ogłoszenia", Icon.list)}
        {session ? (
          item("/dodaj", "Dodaj", Icon.plus, true)
        ) : (
          item("/rejestracja", "Konto", Icon.plus, true)
        )}
        {session
          ? item("/wiadomosci", "Wiadomości", Icon.chat)
          : item("/bezpieczenstwo", "Bezpieczeństwo", Icon.shield)}
        {item(session ? "/profil" : "/logowanie", session ? "Profil" : "Zaloguj", Icon.user)}
      </div>
    </nav>
  );
}

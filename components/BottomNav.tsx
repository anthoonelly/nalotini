"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Start", icon: "🏠" },
  { href: "/ogloszenia", label: "Ogłoszenia", icon: "📋" },
  { href: "/dodaj", label: "Dodaj", icon: "➕", primary: true },
  { href: "/wiadomosci", label: "Wiadomości", icon: "💬" },
  { href: "/profil", label: "Profil", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-slate-100 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px]"
            >
              {item.primary ? (
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-700 text-white -mt-5 shadow-soft text-base">
                  {item.icon}
                </span>
              ) : (
                <span
                  className={`text-lg leading-none ${
                    active ? "" : "opacity-70"
                  }`}
                  aria-hidden
                >
                  {item.icon}
                </span>
              )}
              <span
                className={`${
                  active ? "text-brand-800 font-semibold" : "text-slate-500"
                } ${item.primary ? "mt-0" : ""}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

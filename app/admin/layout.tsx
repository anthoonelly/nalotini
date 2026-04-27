import Link from "next/link";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  const links = [
    { href: "/admin", label: "Pulpit" },
    { href: "/admin/ogloszenia", label: "Ogłoszenia" },
    { href: "/admin/zgloszenia", label: "Zgłoszenia" },
    { href: "/admin/uzytkownicy", label: "Użytkownicy" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-semibold text-amber-900">🛡️ Panel moderatora</span>
        <nav className="flex flex-wrap gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-amber-900 hover:bg-amber-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}

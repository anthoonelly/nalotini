import Link from "next/link";
import {
  getPendingListings,
  getOpenReports,
  getAllUsers,
  getAllListingsForAdmin,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [pending, reports, users, allListings] = await Promise.all([
    getPendingListings(),
    getOpenReports(),
    getAllUsers(),
    getAllListingsForAdmin(),
  ]);

  const activeListings = allListings.filter((l) => l.status === "active").length;
  const stats = [
    { label: "Ogłoszenia do weryfikacji", value: pending.length, href: "/admin/ogloszenia?status=pending", color: "amber" },
    { label: "Otwarte zgłoszenia", value: reports.length, href: "/admin/zgloszenia", color: "rose" },
    { label: "Użytkownicy", value: users.length, href: "/admin/uzytkownicy", color: "brand" },
    { label: "Aktywne ogłoszenia", value: activeListings, href: "/admin/ogloszenia", color: "emerald" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-900">Pulpit administratora</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`card p-5 hover:shadow-soft transition border-l-4 ${
              s.color === "amber"
                ? "border-l-amber-400"
                : s.color === "rose"
                ? "border-l-rose-400"
                : s.color === "emerald"
                ? "border-l-emerald-400"
                : "border-l-brand-500"
            }`}
          >
            <p className="text-3xl font-bold text-brand-900">{s.value}</p>
            <p className="text-sm text-slate-600 mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {pending.length > 0 && (
        <div className="card p-5 bg-amber-50/50 border-amber-200">
          <h2 className="font-semibold text-amber-900 mb-3">
            ⚠️ {pending.length} {pending.length === 1 ? "ogłoszenie wymaga" : "ogłoszeń wymaga"} ręcznej weryfikacji
          </h2>
          <p className="text-sm text-amber-800 mb-3">
            Te ogłoszenia zostały zatrzymane przez automatyczną moderację. Sprawdź flagi i zatwierdź lub odrzuć.
          </p>
          <Link href="/admin/ogloszenia?status=pending" className="btn btn-primary inline-block">
            Przejdź do kolejki →
          </Link>
        </div>
      )}

      {reports.length > 0 && (
        <div className="card p-5 bg-rose-50/50 border-rose-200">
          <h2 className="font-semibold text-rose-900 mb-3">
            🚩 {reports.length} {reports.length === 1 ? "zgłoszenie od użytkowników" : "zgłoszeń od użytkowników"}
          </h2>
          <Link href="/admin/zgloszenia" className="btn btn-primary inline-block">
            Sprawdź zgłoszenia →
          </Link>
        </div>
      )}
    </div>
  );
}

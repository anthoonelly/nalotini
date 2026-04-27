"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Report {
  id: string;
  listingId: string;
  listingTitle?: string;
  reporterId?: string | null;
  reporterName?: string | null;
  reason: string;
  details?: string | null;
  status: string;
  createdAt: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/reports");
    if (res.ok) {
      const data = await res.json();
      setReports(data.reports || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function resolve(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/reports/${id}`, { method: "POST" });
    setBusyId(null);
    if (res.ok) load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-brand-900">
        Otwarte zgłoszenia ({reports.length})
      </h1>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Ładowanie...</div>
      ) : reports.length === 0 ? (
        <div className="card p-8 text-center text-slate-600">
          <p className="text-3xl mb-2">✨</p>
          <p>Brak otwartych zgłoszeń</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="card p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-slate-500">
                    Zgłoszenie • {new Date(r.createdAt).toLocaleString("pl-PL")}
                  </p>
                  <Link
                    href={`/ogloszenia/${r.listingId}`}
                    className="font-semibold text-brand-900 hover:underline"
                  >
                    {r.listingTitle || "Ogłoszenie"}
                  </Link>
                </div>
                <span className="chip-rose">{r.reason}</span>
              </div>

              {r.details && (
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  „{r.details}"
                </div>
              )}

              <p className="text-xs text-slate-500">
                Zgłoszone przez: {r.reporterName || "anonimowo"}
              </p>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link href={`/ogloszenia/${r.listingId}`} className="btn btn-secondary text-sm">
                  Zobacz ogłoszenie
                </Link>
                <button
                  onClick={() => resolve(r.id)}
                  disabled={busyId === r.id}
                  className="btn btn-primary text-sm"
                >
                  Oznacz jako rozwiązane
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

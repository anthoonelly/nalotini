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
  resolvedAt?: string | null;
  resolvedByName?: string | null;
  resolutionNote?: string | null;
}

type Tab = "open" | "resolved";

export default function AdminReportsPage() {
  const [tab, setTab] = useState<Tab>("open");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/reports?status=${tab}`);
    if (res.ok) {
      const data = await res.json();
      setReports(data.reports || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [tab]);

  async function resolve(id: string) {
    const note = prompt("Notatka administracyjna (opcjonalnie, widoczna tylko w historii):") || "";
    setBusyId(id);
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    setBusyId(null);
    if (res.ok) load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-brand-900">
          {tab === "open" ? "Otwarte zgłoszenia" : "Historia zgłoszeń"} ({reports.length})
        </h1>
        <div className="flex gap-1.5">
          <button
            onClick={() => setTab("open")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              tab === "open"
                ? "bg-brand-700 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            🚩 Otwarte
          </button>
          <button
            onClick={() => setTab("resolved")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              tab === "resolved"
                ? "bg-brand-700 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            ✓ Rozwiązane
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Ładowanie...</div>
      ) : reports.length === 0 ? (
        <div className="card p-8 text-center text-slate-600">
          <p className="text-3xl mb-2">{tab === "open" ? "✨" : "📭"}</p>
          <p>
            {tab === "open"
              ? "Brak otwartych zgłoszeń"
              : "Brak rozwiązanych zgłoszeń w historii"}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li
              key={r.id}
              className={`card p-4 sm:p-5 space-y-3 ${
                tab === "resolved" ? "opacity-90" : ""
              }`}
            >
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
                <span className={tab === "resolved" ? "chip-slate" : "chip-rose"}>
                  {r.reason}
                </span>
              </div>

              {r.details && (
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  „{r.details}"
                </div>
              )}

              <p className="text-xs text-slate-500">
                Zgłoszone przez: {r.reporterName || "anonimowo"}
              </p>

              {tab === "resolved" && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs space-y-1">
                  <p className="font-semibold text-emerald-900">
                    ✓ Rozwiązane{" "}
                    {r.resolvedAt
                      ? `${new Date(r.resolvedAt).toLocaleString("pl-PL")}`
                      : ""}
                  </p>
                  {r.resolvedByName && (
                    <p className="text-emerald-800">
                      przez: {r.resolvedByName}
                    </p>
                  )}
                  {r.resolutionNote && (
                    <p className="text-emerald-800 italic">
                      Notatka: „{r.resolutionNote}"
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link
                  href={`/ogloszenia/${r.listingId}`}
                  className="btn btn-secondary text-sm"
                >
                  Zobacz ogłoszenie
                </Link>
                {tab === "open" && (
                  <button
                    onClick={() => resolve(r.id)}
                    disabled={busyId === r.id}
                    className="btn btn-primary text-sm"
                  >
                    Oznacz jako rozwiązane
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

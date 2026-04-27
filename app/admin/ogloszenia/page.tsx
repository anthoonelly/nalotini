"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Listing } from "@/lib/types";
import CategoryBadge from "@/components/CategoryBadge";
import Avatar from "@/components/Avatar";

function AdminListingsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";
  const [filter, setFilter] = useState<string>(initialStatus);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const url = filter === "pending"
      ? "/api/admin/listings?status=pending_review"
      : "/api/admin/listings";
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      let result = data.listings || [];
      if (filter === "active") result = result.filter((l: Listing) => l.status === "active");
      if (filter === "rejected") result = result.filter((l: Listing) => l.status === "rejected");
      setListings(result);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [filter]);

  async function act(id: string, action: "approve" | "reject" | "delete" | "close", note?: string) {
    if (action === "delete" && !confirm("Usunąć ogłoszenie? Tej operacji nie da się cofnąć.")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/listings/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, note }),
    });
    setBusyId(null);
    if (res.ok) load();
    else alert("Nie udało się wykonać akcji");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-brand-900">
          Ogłoszenia ({listings.length})
        </h1>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { v: "all", l: "Wszystkie" },
            { v: "pending", l: "Do weryfikacji" },
            { v: "active", l: "Aktywne" },
            { v: "rejected", l: "Odrzucone" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setFilter(o.v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === o.v
                  ? "bg-brand-700 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Ładowanie...</div>
      ) : listings.length === 0 ? (
        <div className="card p-8 text-center text-slate-600">
          <p className="text-3xl mb-2">✨</p>
          <p>Brak ogłoszeń w tej kategorii</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {listings.map((l) => {
            const flags = l.moderationFlags || [];
            const isPending = l.status === "pending_review";
            return (
              <li key={l.id} className="card p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={l.authorName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{l.authorName}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(l.createdAt).toLocaleString("pl-PL")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    <CategoryBadge category={l.category} />
                    <span
                      className={
                        l.status === "active"
                          ? "chip-green"
                          : l.status === "pending_review"
                          ? "chip-amber"
                          : l.status === "rejected"
                          ? "chip-rose"
                          : "chip-slate"
                      }
                    >
                      {l.status === "active"
                        ? "Aktywne"
                        : l.status === "pending_review"
                        ? "Do weryfikacji"
                        : l.status === "rejected"
                        ? "Odrzucone"
                        : "Zamknięte"}
                    </span>
                  </div>
                </div>

                <div>
                  <Link
                    href={`/ogloszenia/${l.id}`}
                    className="font-semibold text-brand-900 hover:underline"
                  >
                    {l.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-1">
                    📍 {l.location}
                    {l.flightDate ? ` • 📅 ${new Date(l.flightDate).toLocaleDateString("pl-PL")}` : ""}
                  </p>
                  <p className="text-sm text-slate-700 mt-2 line-clamp-2">{l.description}</p>
                </div>

                {flags.length > 0 && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <p className="text-xs font-semibold text-amber-900 mb-1">
                      Wykryte flagi automatycznej moderacji:
                    </p>
                    <ul className="text-xs text-amber-800 space-y-0.5">
                      {flags.map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <Link href={`/ogloszenia/${l.id}`} className="btn btn-ghost text-sm">
                    Zobacz szczegóły
                  </Link>
                  {isPending && (
                    <>
                      <button
                        onClick={() => act(l.id, "approve")}
                        disabled={busyId === l.id}
                        className="btn btn-primary text-sm"
                      >
                        ✓ Zatwierdź
                      </button>
                      <button
                        onClick={() => {
                          const note = prompt("Powód odrzucenia (widoczny dla autora):") || "";
                          act(l.id, "reject", note);
                        }}
                        disabled={busyId === l.id}
                        className="btn btn-secondary text-sm !text-rose-700"
                      >
                        ✗ Odrzuć
                      </button>
                    </>
                  )}
                  {l.status === "active" && (
                    <button
                      onClick={() => act(l.id, "close")}
                      disabled={busyId === l.id}
                      className="btn btn-ghost text-sm text-slate-600"
                    >
                      Zamknij
                    </button>
                  )}
                  <button
                    onClick={() => act(l.id, "delete")}
                    disabled={busyId === l.id}
                    className="btn btn-ghost text-sm text-rose-700"
                  >
                    🗑 Usuń
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function AdminListingsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-500">Ładowanie...</div>}>
      <AdminListingsContent />
    </Suspense>
  );
}

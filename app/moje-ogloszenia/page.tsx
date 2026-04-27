"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import Avatar from "@/components/Avatar";
import CategoryBadge from "@/components/CategoryBadge";

export default function MyListingsPage() {
  const {
    listings,
    reservations,
    currentUser,
    acceptReservation,
    rejectReservation,
  } = useApp();

  const mine = listings.filter((l) => l.authorId === currentUser.id);

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Moje ogłoszenia</h1>
          <p className="text-sm text-slate-600 mt-1">
            Ogłoszenia, których jesteś autorem oraz prośby o miejsce.
          </p>
        </div>
        <Link href="/dodaj" className="btn-primary text-sm">
          ➕ Dodaj nowe
        </Link>
      </div>

      {mine.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          <p className="text-3xl mb-2">🛫</p>
          <p className="text-sm">Nie masz jeszcze żadnych ogłoszeń.</p>
          <Link href="/dodaj" className="btn-primary mt-4 inline-flex">
            Dodaj pierwsze
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {mine.map((listing) => {
            const requests = reservations.filter((r) => r.listingId === listing.id);
            const pending = requests.filter((r) => r.status === "pending");

            return (
              <li key={listing.id} className="card p-5 space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <CategoryBadge category={listing.category} />
                    <Link
                      href={`/ogloszenia/${listing.id}`}
                      className="block mt-2 text-lg font-semibold text-brand-900 hover:underline"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {listing.startLocation}
                      {listing.destinationLocation
                        ? ` → ${listing.destinationLocation}`
                        : ""}{" "}
                      · {listing.date}, {listing.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Wolne miejsca</p>
                    <p className="text-xl font-semibold text-brand-900">
                      {listing.availableSeats}{" "}
                      <span className="text-sm text-slate-500 font-normal">
                        z {listing.totalSeats}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-brand-800 mb-2">
                    Prośby o miejsce ({requests.length})
                    {pending.length > 0 && (
                      <span className="ml-2 chip-amber">
                        {pending.length} nowych
                      </span>
                    )}
                  </h3>
                  {requests.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Brak zgłoszeń. Gdy ktoś poprosi o miejsce, pojawi się tutaj.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {requests.map((res) => (
                        <li
                          key={res.id}
                          className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-slate-50/70 rounded-xl p-3"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <Avatar name={res.userName} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-brand-900">
                                {res.userName}{" "}
                                <span className="text-xs text-slate-500 font-normal">
                                  · {res.seatsRequested}{" "}
                                  {res.seatsRequested === 1
                                    ? "miejsce"
                                    : "miejsca"}
                                </span>
                              </p>
                              {res.message && (
                                <p className="text-sm text-slate-600 mt-0.5">
                                  „{res.message}”
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {res.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => acceptReservation(res.id)}
                                  className="btn-primary text-xs !py-2"
                                  disabled={
                                    listing.availableSeats < res.seatsRequested
                                  }
                                  title={
                                    listing.availableSeats < res.seatsRequested
                                      ? "Za mało wolnych miejsc"
                                      : ""
                                  }
                                >
                                  Akceptuj
                                </button>
                                <button
                                  onClick={() => rejectReservation(res.id)}
                                  className="btn-secondary text-xs !py-2"
                                >
                                  Odrzuć
                                </button>
                              </>
                            ) : (
                              <span
                                className={
                                  res.status === "accepted"
                                    ? "chip-green"
                                    : res.status === "rejected"
                                    ? "chip-red"
                                    : "chip-slate"
                                }
                              >
                                {res.status === "accepted" && "Zaakceptowana"}
                                {res.status === "rejected" && "Odrzucona"}
                                {res.status === "cancelled" && "Anulowana"}
                                {res.status === "completed" && "Zakończona"}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-brand-800 mb-2">
                    Aktualni uczestnicy
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.participants.map((p) => (
                      <div
                        key={p.userId}
                        className="flex items-center gap-2 bg-slate-50 rounded-full pl-1 pr-3 py-1"
                      >
                        <Avatar name={p.name} size="sm" />
                        <span className="text-xs">
                          <span className="font-semibold text-brand-900">{p.name}</span>{" "}
                          <span className="text-slate-500">· {p.role}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

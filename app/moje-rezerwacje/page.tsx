"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ReservationStatus } from "@/lib/types";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "Oczekuje na akceptację",
  accepted: "Zaakceptowana",
  rejected: "Odrzucona",
  cancelled: "Anulowana",
  completed: "Zakończona",
};

const STATUS_CHIP: Record<ReservationStatus, string> = {
  pending: "chip-amber",
  accepted: "chip-green",
  rejected: "chip-red",
  cancelled: "chip-slate",
  completed: "chip-slate",
};

export default function MyReservationsPage() {
  const router = useRouter();
  const { reservations, listings, currentUser, cancelReservation, startConversation } =
    useApp();

  const mine = reservations.filter((r) => r.userId === currentUser.id);

  function handleMessage(listingId: string) {
    const id = startConversation(listingId);
    router.push(`/wiadomosci?conv=${id}`);
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Moje rezerwacje</h1>
        <p className="text-sm text-slate-600 mt-1">
          Twoje prośby o miejsce w cudzych ogłoszeniach.
        </p>
      </div>

      {mine.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">Nie masz jeszcze żadnych rezerwacji.</p>
          <Link href="/ogloszenia" className="btn-primary mt-4 inline-flex">
            Przeglądaj ogłoszenia
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {mine.map((res) => {
            const listing = listings.find((l) => l.id === res.listingId);
            if (!listing) return null;
            return (
              <li key={res.id} className="card p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <Link
                      href={`/ogloszenia/${listing.id}`}
                      className="font-semibold text-brand-900 hover:underline"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Autor: {listing.authorName} · {listing.date}, {listing.time}
                    </p>
                  </div>
                  <span className={STATUS_CHIP[res.status]}>
                    {STATUS_LABEL[res.status]}
                  </span>
                </div>

                <div className="text-sm text-slate-600">
                  <p>
                    <span className="text-slate-500">Liczba miejsc:</span>{" "}
                    <span className="font-medium text-brand-900">
                      {res.seatsRequested}
                    </span>
                  </p>
                  {res.message && (
                    <p className="mt-1">
                      <span className="text-slate-500">Twoja wiadomość:</span> „
                      {res.message}”
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {res.status === "pending" && (
                    <button
                      onClick={() => cancelReservation(res.id)}
                      className="btn-secondary text-xs !py-2"
                    >
                      Anuluj prośbę
                    </button>
                  )}
                  <button
                    onClick={() => handleMessage(listing.id)}
                    className="btn-ghost text-xs !py-2"
                  >
                    💬 Napisz wiadomość
                  </button>
                  <Link
                    href={`/ogloszenia/${listing.id}`}
                    className="btn-ghost text-xs !py-2"
                  >
                    Zobacz ogłoszenie
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

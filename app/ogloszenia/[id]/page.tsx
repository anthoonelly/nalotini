"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/store";
import CategoryBadge from "@/components/CategoryBadge";
import Avatar from "@/components/Avatar";
import SafetyNote from "@/components/SafetyNote";
import ReservationModal from "@/components/ReservationModal";
import ReportModal from "@/components/ReportModal";

function formatCost(listing: ReturnType<typeof formatCostInput>): string {
  if (listing.costType === "brak kosztów") return "Bez kosztów";
  if (listing.costAmount && listing.costCurrency) {
    return `ok. ${listing.costAmount} ${listing.costCurrency} / osoba`;
  }
  if (listing.costType === "koszt do ustalenia") return "Do ustalenia";
  if (listing.costType === "podział kosztów") return "Podział kosztów równo";
  if (listing.costType === "zależny od trasy/czasu/pogody") return "Zależnie od warunków";
  return "Do ustalenia";
}

function formatCostInput(arg: {
  costType: string;
  costAmount?: number;
  costCurrency?: string;
}) {
  return arg;
}

export default function ListingDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getListing, currentUser, startConversation } = useApp();

  const [reservationOpen, setReservationOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const listing = getListing(params.id);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#poprosic" && listing) {
      setReservationOpen(true);
    }
  }, [listing]);

  if (!listing) {
    return (
      <div className="card p-8 text-center">
        <p className="text-3xl mb-2">🛬</p>
        <h1 className="text-lg font-semibold text-brand-900">Ogłoszenie nie istnieje</h1>
        <p className="text-sm text-slate-600 mt-1">
          Mogło zostać usunięte lub link jest niepoprawny.
        </p>
        <Link href="/ogloszenia" className="btn-primary mt-4 inline-flex">
          Wróć do listy
        </Link>
      </div>
    );
  }

  const isAuthor = listing.authorId === currentUser.id;
  const noSeats = listing.availableSeats === 0;
  const route = listing.destinationLocation
    ? `${listing.startLocation} → ${listing.destinationLocation}`
    : listing.startLocation;

  function handleMessage() {
    const id = startConversation(listing!.id);
    router.push(`/wiadomosci?conv=${id}`);
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <Link href="/ogloszenia" className="text-sm text-brand-700 hover:text-brand-800">
        ← Wróć do ogłoszeń
      </Link>

      <div className="card p-5 sm:p-7 space-y-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <CategoryBadge category={listing.category} />
          <span
            className={
              listing.status === "Aktualne" && !noSeats
                ? "chip-green"
                : noSeats
                ? "chip-amber"
                : "chip-slate"
            }
          >
            {noSeats ? "Brak wolnych miejsc" : listing.status}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 leading-tight">
          {listing.title}
        </h1>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <Avatar name={listing.authorName} size="lg" />
          <div>
            <p className="font-semibold text-brand-900">{listing.authorName}</p>
            <p className="text-sm text-slate-600">{listing.authorRole}</p>
          </div>
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Fact icon="📍" label="Lokalizacja" value={route} />
          {listing.startAirport && (
            <Fact icon="🛫" label="Lotnisko startu" value={listing.startAirport} />
          )}
          {listing.destinationAirport && (
            <Fact
              icon="🛬"
              label="Lotnisko docelowe"
              value={listing.destinationAirport}
            />
          )}
          <Fact icon="📅" label="Data" value={listing.date} />
          <Fact icon="🕒" label="Godzina" value={listing.time} />
          <Fact icon="🎯" label="Typ aktywności" value={listing.activityType} />
          <Fact
            icon="💺"
            label="Wolne miejsca"
            value={`${listing.availableSeats} z ${listing.totalSeats}`}
          />
          <Fact icon="💸" label="Udział w kosztach" value={formatCost(listing)} />
          <Fact icon="💼" label="Sposób rozliczenia" value={listing.settlementMethod} />
        </div>

        <SafetyNote variant="info">
          Podana kwota to orientacyjny udział w kosztach, a nie cena biletu.
          Rozliczenie odbywa się bezpośrednio z autorem poza aplikacją.
        </SafetyNote>

        {/* Description */}
        <div>
          <h2 className="font-semibold text-brand-900 mb-1.5">Opis</h2>
          <p className="text-sm text-slate-700 whitespace-pre-line">{listing.description}</p>
        </div>

        {listing.requirements && (
          <div>
            <h2 className="font-semibold text-brand-900 mb-1.5">Wymagania</h2>
            <p className="text-sm text-slate-700 whitespace-pre-line">{listing.requirements}</p>
          </div>
        )}

        {listing.organizationNotes && (
          <div>
            <h2 className="font-semibold text-brand-900 mb-1.5">Informacje organizacyjne</h2>
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {listing.organizationNotes}
            </p>
          </div>
        )}

        {/* Participants */}
        <div>
          <h2 className="font-semibold text-brand-900 mb-2">
            Uczestnicy ({listing.participants.length})
          </h2>
          <ul className="space-y-2">
            {listing.participants.map((p) => (
              <li key={p.userId} className="flex items-center gap-3">
                <Avatar name={p.name} />
                <div>
                  <p className="text-sm font-medium text-brand-900">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <SafetyNote variant="warning">
          Nalotini nie organizuje lotów i nie obsługuje płatności. Szczegóły
          ustalasz bezpośrednio z autorem ogłoszenia. Rezerwacja jest
          zgłoszeniem chęci udziału, a nie gwarancją wykonania lotu.
        </SafetyNote>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2" id="poprosic">
          {!isAuthor && (
            <button
              onClick={() => setReservationOpen(true)}
              className="btn-primary flex-1"
              disabled={noSeats}
            >
              {noSeats ? "Brak wolnych miejsc" : "Poproś o miejsce"}
            </button>
          )}
          <button onClick={handleMessage} className="btn-secondary flex-1">
            Napisz do autora
          </button>
          <button
            onClick={() => setReportOpen(true)}
            className="btn-ghost text-xs sm:text-sm"
          >
            🚩 Zgłoś ogłoszenie
          </button>
        </div>
      </div>

      <ReservationModal
        open={reservationOpen}
        onClose={() => setReservationOpen(false)}
        listing={listing}
      />
      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        listingId={listing.id}
      />
    </div>
  );
}

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50/70 px-3 py-2.5">
      <span aria-hidden className="text-base">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
          {label}
        </p>
        <p className="text-sm text-brand-900 font-medium">{value}</p>
      </div>
    </div>
  );
}

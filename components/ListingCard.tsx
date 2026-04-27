"use client";

import Link from "next/link";
import { Listing } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";
import Avatar from "./Avatar";

function formatCost(listing: Listing): string {
  if (listing.costType === "brak kosztów") return "Bez kosztów";
  if (listing.costAmount && listing.costCurrency) {
    return `ok. ${listing.costAmount} ${listing.costCurrency} / osoba`;
  }
  if (listing.costType === "koszt do ustalenia") return "Do ustalenia";
  if (listing.costType === "podział kosztów") return "Podział kosztów";
  if (listing.costType === "zależny od trasy/czasu/pogody") return "Zależnie od warunków";
  return "Do ustalenia";
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const noSeats = listing.availableSeats === 0;
  const route = listing.destinationLocation
    ? `${listing.startLocation} → ${listing.destinationLocation}`
    : listing.startLocation;

  return (
    <article className="card p-4 sm:p-5 flex flex-col gap-3 hover:shadow-soft transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={listing.authorName} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {listing.authorName}
            </p>
            <p className="text-xs text-slate-500 truncate">{listing.authorRole}</p>
          </div>
        </div>
        <CategoryBadge category={listing.category} />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-brand-900 leading-snug">
        {listing.title}
      </h3>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div className="flex items-start gap-1.5">
          <span aria-hidden>📍</span>
          <span className="truncate">{route}</span>
        </div>
        <div className="flex items-start gap-1.5">
          <span aria-hidden>📅</span>
          <span>
            {listing.date}, {listing.time}
          </span>
        </div>
        <div className="flex items-start gap-1.5">
          <span aria-hidden>💺</span>
          <span>
            {listing.availableSeats} z {listing.totalSeats} wolnych
          </span>
        </div>
        <div className="flex items-start gap-1.5">
          <span aria-hidden>💸</span>
          <span className="truncate">{formatCost(listing)}</span>
        </div>
      </div>

      {listing.participants.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="flex -space-x-2">
            {listing.participants.slice(0, 4).map((p) => (
              <div key={p.userId} className="ring-2 ring-white rounded-full">
                <Avatar name={p.name} size="sm" />
              </div>
            ))}
          </div>
          <span className="truncate">
            {listing.participants.map((p) => p.name).join(", ")}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <span
          className={
            noSeats
              ? "chip-slate"
              : listing.status === "Aktualne"
              ? "chip-green"
              : "chip-slate"
          }
        >
          {noSeats ? "Brak wolnych miejsc" : listing.status}
        </span>
        <div className="flex gap-2">
          <Link href={`/ogloszenia/${listing.id}`} className="btn-secondary !py-2 !px-3 text-xs">
            Zobacz szczegóły
          </Link>
          <Link
            href={`/ogloszenia/${listing.id}#poprosic`}
            className="btn-primary !py-2 !px-3 text-xs"
          >
            Poproś o miejsce
          </Link>
        </div>
      </div>
    </article>
  );
}

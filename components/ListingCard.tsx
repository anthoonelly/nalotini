import Link from "next/link";
import { Listing } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";
import Avatar from "./Avatar";

function formatCost(listing: Listing): string {
  if (listing.costType === "free") return "Bez kosztów";
  if (listing.costType === "share") return "Podział kosztów";
  if (listing.costType === "fuel") return "Tylko paliwo";
  if (listing.costAmount) return `ok. ${listing.costAmount} PLN / osoba`;
  return "Do uzgodnienia";
}

function formatDate(date: string | null | undefined, time: string | null | undefined): string {
  if (!date) return "Termin do ustalenia";
  const d = new Date(date);
  const formatted = d.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
  });
  return time ? `${formatted}, ${time}` : formatted;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const noSeats =
    listing.availableSeats !== null &&
    listing.availableSeats !== undefined &&
    listing.availableSeats <= 0;
  const route = listing.destination
    ? `${listing.location} → ${listing.destination}`
    : listing.location;

  return (
    <article className="card p-4 sm:p-5 flex flex-col gap-3 hover:shadow-soft transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={listing.authorName} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {listing.authorName}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {listing.type === "offer" ? "Oferuje miejsce" : "Szuka miejsca"}
            </p>
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
          <span>{formatDate(listing.flightDate, listing.flightTime)}</span>
        </div>
        {listing.totalSeats !== null && listing.totalSeats !== undefined && (
          <div className="flex items-start gap-1.5">
            <span aria-hidden>💺</span>
            <span>
              {listing.availableSeats ?? listing.totalSeats} z {listing.totalSeats} wolnych
            </span>
          </div>
        )}
        <div className="flex items-start gap-1.5">
          <span aria-hidden>💸</span>
          <span className="truncate">{formatCost(listing)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <span className={noSeats ? "chip-slate" : "chip-green"}>
          {noSeats ? "Brak wolnych miejsc" : "Aktualne"}
        </span>
        <div className="flex gap-2">
          <Link href={`/ogloszenia/${listing.id}`} className="btn-secondary !py-2 !px-3 text-xs">
            Szczegóły
          </Link>
          {!noSeats && listing.type === "offer" && (
            <Link
              href={`/ogloszenia/${listing.id}#poprosic`}
              className="btn-primary !py-2 !px-3 text-xs"
            >
              Poproś o miejsce
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

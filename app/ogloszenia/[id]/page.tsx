import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById, getReservationsForListing } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";
import CategoryBadge from "@/components/CategoryBadge";
import Avatar from "@/components/Avatar";
import SafetyNote from "@/components/SafetyNote";
import ListingDetailActions from "./actions";

export const dynamic = "force-dynamic";

function fmtDate(date: string | null | undefined, time: string | null | undefined) {
  if (!date) return "Termin do ustalenia";
  const d = new Date(date);
  const formatted = d.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return time ? `${formatted}, ${time}` : formatted;
}

function fmtCost(listing: Awaited<ReturnType<typeof getListingById>>) {
  if (!listing) return "";
  if (listing.costType === "free") return "Bez kosztów";
  if (listing.costAmount) return `${listing.costAmount} PLN / osoba`;
  // Legacy fallbacks
  if (listing.costType === "share") return "Podział kosztów";
  if (listing.costType === "fuel") return "Tylko paliwo";
  return "Do uzgodnienia";
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await getListingById(params.id);
  if (!listing) notFound();

  const user = await getSessionUser();
  const isAuthor = user?.id === listing.authorId;
  const reservations = isAuthor || user?.role === "admin"
    ? await getReservationsForListing(listing.id)
    : [];

  const noSeats =
    listing.availableSeats !== null &&
    listing.availableSeats !== undefined &&
    listing.availableSeats <= 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link href="/ogloszenia" className="text-sm text-brand-700 hover:underline">
        ← Wróć do ogłoszeń
      </Link>

      <article className="card p-6 space-y-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Avatar name={listing.authorName} size="lg" />
            <div>
              <p className="font-semibold text-slate-900">{listing.authorName}</p>
              <p className="text-xs text-slate-500">
                {listing.type === "offer" ? "Oferuje miejsce" : "Szuka miejsca"}
              </p>
            </div>
          </div>
          <CategoryBadge category={listing.category} />
        </div>

        <h1 className="text-2xl font-bold text-brand-900 leading-tight">{listing.title}</h1>

        {listing.status === "pending_review" && (
          <SafetyNote variant="warning">
            To ogłoszenie oczekuje na ręczną weryfikację moderatora i nie jest jeszcze widoczne publicznie.
          </SafetyNote>
        )}

        {listing.status === "rejected" && (
          <SafetyNote variant="warning">
            Ogłoszenie zostało odrzucone przez moderatora.
            {listing.moderationNote ? ` Powód: ${listing.moderationNote}` : ""}
          </SafetyNote>
        )}

        {/* Fact tiles */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Fact icon="📍" label="Skąd → Dokąd">
            {listing.location}
            {listing.destination ? ` → ${listing.destination}` : ""}
          </Fact>
          <Fact icon="📅" label="Termin">
            {fmtDate(listing.flightDate, listing.flightTime)}
          </Fact>
          {listing.totalSeats !== null && listing.totalSeats !== undefined && (
            <Fact icon="💺" label="Miejsca">
              {listing.availableSeats ?? listing.totalSeats} z {listing.totalSeats} wolnych
            </Fact>
          )}
          <Fact icon="💸" label="Koszty">
            {fmtCost(listing)}
            {listing.settlementMethod ? ` • ${listing.settlementMethod}` : ""}
          </Fact>
          {listing.activityType && (
            <Fact icon="🎯" label="Rodzaj aktywności">
              {listing.activityType}
            </Fact>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 mb-1.5">Opis</h2>
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Actions */}
        <ListingDetailActions
          listing={listing}
          isAuthor={isAuthor}
          isLoggedIn={!!user}
          isAdmin={user?.role === "admin"}
          noSeats={noSeats}
        />

        {/* Reservations (author/admin only) */}
        {(isAuthor || user?.role === "admin") && reservations.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <h2 className="font-semibold text-slate-900 mb-3">
              Prośby o miejsce ({reservations.length})
            </h2>
            <ul className="space-y-2">
              {reservations.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={r.userName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{r.userName}</p>
                      <p className="text-xs text-slate-500">
                        {r.seats} {r.seats === 1 ? "miejsce" : "miejsca"} •{" "}
                        {r.status === "pending"
                          ? "oczekuje"
                          : r.status === "accepted"
                          ? "zaakceptowana"
                          : r.status === "rejected"
                          ? "odrzucona"
                          : "anulowana"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/moje-ogloszenia"
                    className="text-xs text-brand-700 font-medium hover:underline"
                  >
                    Zarządzaj →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <SafetyNote variant="info">
        Pamiętaj: rezerwacja w Nalotini to prośba o miejsce. Wszelkie ustalenia
        i rozliczenia są bezpośrednie między Tobą a autorem. Sprawdź zasady na
        stronie{" "}
        <Link href="/bezpieczenstwo" className="underline font-medium">
          Bezpieczeństwo
        </Link>
        .
      </SafetyNote>
    </div>
  );
}

function Fact({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-brand-50/50 p-3">
      <p className="text-xs text-slate-500 flex items-center gap-1.5">
        <span aria-hidden>{icon}</span>
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900 mt-0.5">{children}</p>
    </div>
  );
}

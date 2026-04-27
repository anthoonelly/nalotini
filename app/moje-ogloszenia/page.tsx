import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getListingsByAuthor, getReservationsForAuthor } from "@/lib/queries";
import CategoryBadge from "@/components/CategoryBadge";
import Avatar from "@/components/Avatar";
import MyListingsActions from "./actions";

export const dynamic = "force-dynamic";

export default async function MyListingsPage() {
  const user = await requireUser();
  const listings = await getListingsByAuthor(user.id);
  const reservations = await getReservationsForAuthor(user.id);

  const pendingReservations = reservations.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Moje ogłoszenia</h1>
          <p className="text-sm text-slate-600">Ogłoszenia, które dodałeś/aś.</p>
        </div>
        <Link href="/dodaj" className="btn btn-primary">
          + Dodaj ogłoszenie
        </Link>
      </header>

      {/* Pending reservations needing action */}
      {pendingReservations.length > 0 && (
        <section className="card p-5 bg-amber-50/50 border-amber-200">
          <h2 className="font-semibold text-brand-900 mb-3">
            ⏳ Czekają na Twoją odpowiedź ({pendingReservations.length})
          </h2>
          <ul className="space-y-3">
            {pendingReservations.map((r) => (
              <li
                key={r.id}
                className="bg-white rounded-xl p-3 flex items-start justify-between gap-3 flex-wrap"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <Avatar name={r.userName} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{r.userName}</p>
                    <Link
                      href={`/ogloszenia/${r.listingId}`}
                      className="text-xs text-brand-700 hover:underline"
                    >
                      {r.listingTitle}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1">
                      {r.seats} {r.seats === 1 ? "miejsce" : "miejsca"}
                    </p>
                    {r.message && (
                      <p className="text-sm text-slate-700 mt-1.5 italic">„{r.message}"</p>
                    )}
                  </div>
                </div>
                <MyListingsActions reservationId={r.id} otherUserId={r.userId} listingId={r.listingId} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Listings */}
      {listings.length === 0 ? (
        <div className="card p-8 text-center text-slate-600">
          <p className="text-3xl mb-2">✈️</p>
          <p className="font-medium">Nie masz jeszcze żadnych ogłoszeń</p>
          <p className="text-sm mt-1">
            Dodaj pierwsze ogłoszenie i podziel się swoim lotem ze społecznością.
          </p>
          <Link href="/dodaj" className="btn btn-primary mt-4 inline-block">
            + Dodaj ogłoszenie
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {listings.map((l) => {
            const statusMeta =
              l.status === "active"
                ? { label: "Aktywne", chip: "chip-green" }
                : l.status === "pending_review"
                ? { label: "Oczekuje na weryfikację", chip: "chip-amber" }
                : l.status === "rejected"
                ? { label: "Odrzucone", chip: "chip-rose" }
                : { label: "Zamknięte", chip: "chip-slate" };
            const acceptedCount = reservations.filter(
              (r) => r.listingId === l.id && r.status === "accepted"
            ).length;

            return (
              <li key={l.id} className="card p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <Link
                      href={`/ogloszenia/${l.id}`}
                      className="font-semibold text-brand-900 hover:underline"
                    >
                      {l.title}
                    </Link>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <CategoryBadge category={l.category} />
                      <span className={statusMeta.chip}>{statusMeta.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      📍 {l.location}
                      {l.flightDate ? ` • 📅 ${new Date(l.flightDate).toLocaleDateString("pl-PL")}` : ""}
                      {l.totalSeats !== null && l.totalSeats !== undefined
                        ? ` • 💺 ${l.availableSeats}/${l.totalSeats}`
                        : ""}
                      {acceptedCount > 0 && ` • ✅ ${acceptedCount} przyjętych`}
                    </p>
                    {l.moderationNote && (
                      <p className="text-xs text-rose-700 mt-1.5">
                        Notatka moderatora: {l.moderationNote}
                      </p>
                    )}
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

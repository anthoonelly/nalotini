import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getReservationsByUser } from "@/lib/queries";
import MyReservationsActions from "./actions";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; chip: string }> = {
  pending: { label: "Oczekuje", chip: "chip-amber" },
  accepted: { label: "Zaakceptowana", chip: "chip-green" },
  rejected: { label: "Odrzucona", chip: "chip-rose" },
  cancelled: { label: "Anulowana", chip: "chip-slate" },
};

export default async function MyReservationsPage() {
  const user = await requireUser();
  const reservations = await getReservationsByUser(user.id);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-brand-900">Moje rezerwacje</h1>
        <p className="text-sm text-slate-600">
          Twoje prośby o miejsca w cudzych ogłoszeniach.
        </p>
      </header>

      {reservations.length === 0 ? (
        <div className="card p-8 text-center text-slate-600">
          <p className="text-3xl mb-2">📋</p>
          <p className="font-medium">Nie masz jeszcze żadnych rezerwacji</p>
          <p className="text-sm mt-1">
            Przeglądaj ogłoszenia i poproś o miejsce w lotach, które Cię interesują.
          </p>
          <Link href="/ogloszenia" className="btn btn-primary mt-4 inline-block">
            Przeglądaj ogłoszenia
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {reservations.map((r) => {
            const meta = STATUS_LABELS[r.status] || STATUS_LABELS.pending;
            return (
              <li key={r.id} className="card p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <Link
                      href={`/ogloszenia/${r.listingId}`}
                      className="font-semibold text-brand-900 hover:underline"
                    >
                      {r.listingTitle || "Ogłoszenie"}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1">
                      {r.seats} {r.seats === 1 ? "miejsce" : "miejsca"} •{" "}
                      {new Date(r.createdAt).toLocaleDateString("pl-PL")}
                    </p>
                    {r.message && (
                      <p className="text-sm text-slate-700 mt-2 italic">
                        „{r.message}"
                      </p>
                    )}
                  </div>
                  <span className={meta.chip}>{meta.label}</span>
                </div>

                {r.status === "pending" && (
                  <MyReservationsActions reservationId={r.id} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

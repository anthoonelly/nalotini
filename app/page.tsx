import Link from "next/link";
import { getActiveListings } from "@/lib/queries";
import ListingCard from "@/components/ListingCard";
import SafetyNote from "@/components/SafetyNote";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSessionUser();
  let listings: Awaited<ReturnType<typeof getActiveListings>> = [];
  let dbError: string | null = null;
  try {
    listings = await getActiveListings({ limit: 4, onlyAvailable: true });
  } catch (e: any) {
    dbError = e?.message || "Błąd połączenia z bazą";
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white p-6 sm:p-10 shadow-soft">
        <div className="absolute -top-12 -right-12 text-[160px] opacity-10 select-none">✈️</div>
        <div className="relative max-w-2xl space-y-4">
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            Lataj wspólnie. Dziel koszty.
          </h1>
          <p className="text-sm sm:text-base text-brand-50/90">
            Nalotini łączy pilotów, pasjonatów i osoby ciekawe lotnictwa.
            Oferuj wolne miejsca, proś o zabranie albo szukaj kompana w niebo —
            zawsze niekomercyjnie, na zasadzie podziału kosztów.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/ogloszenia" className="btn btn-accent">
              Przeglądaj ogłoszenia
            </Link>
            {user ? (
              <Link href="/dodaj" className="btn btn-secondary">
                + Dodaj ogłoszenie
              </Link>
            ) : (
              <Link href="/rejestracja" className="btn btn-secondary">
                Załóż konto
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Latest listings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-900">Najnowsze ogłoszenia</h2>
          <Link href="/ogloszenia" className="text-sm font-medium text-brand-700 hover:underline">
            Zobacz wszystkie →
          </Link>
        </div>

        {dbError ? (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 text-rose-900">
            <p className="font-semibold">Baza danych nie jest jeszcze podłączona</p>
            <p className="text-sm mt-2">
              Otwórz panel Vercela, przejdź do <b>Storage → Create Database → Neon</b>,
              a następnie wykonaj redeploy. Szczegóły konfiguracji znajdziesz w pliku README.md.
            </p>
            <p className="text-xs mt-3 text-rose-700/70 font-mono">{dbError}</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
            <p className="text-3xl mb-2">🛩️</p>
            <p className="text-slate-700 font-medium">
              Jeszcze nie ma ogłoszeń — bądź pierwszy!
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Dodaj swoje ogłoszenie i zaproś innych do wspólnego latania.
            </p>
            <Link href={user ? "/dodaj" : "/rejestracja"} className="btn btn-primary mt-4">
              {user ? "+ Dodaj pierwsze ogłoszenie" : "Załóż konto"}
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="card p-6 sm:p-8 space-y-5">
        <h2 className="text-xl font-bold text-brand-900">Jak to działa</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              title: "Załóż konto",
              text: "Bezpłatnie, w 30 sekund. Tylko email i hasło.",
            },
            {
              step: "2",
              title: "Dodaj ogłoszenie lub poproś o miejsce",
              text: "Oferuj wolne miejsce w swoim locie albo szukaj kogoś, kto Cię zabierze.",
            },
            {
              step: "3",
              title: "Skontaktujcie się i polećcie",
              text: "Po akceptacji rezerwacji ustalcie szczegóły i podział kosztów poza aplikacją.",
            },
          ].map((s) => (
            <div key={s.step} className="rounded-xl bg-brand-50/50 p-4 space-y-2">
              <div className="h-8 w-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm">
                {s.step}
              </div>
              <h3 className="font-semibold text-brand-900">{s.title}</h3>
              <p className="text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <SafetyNote variant="info">
        <b>Pamiętaj:</b> Nalotini to platforma niekomercyjna. Nie sprzedajemy
        biletów, nie pobieramy prowizji. Wszelkie rozliczenia (podział kosztów
        paliwa, opłat lotniskowych) odbywają się bezpośrednio między pilotem a
        pasażerem. Sprawdź zasady na stronie{" "}
        <Link href="/bezpieczenstwo" className="underline font-medium">
          Bezpieczeństwo
        </Link>
        .
      </SafetyNote>
    </div>
  );
}

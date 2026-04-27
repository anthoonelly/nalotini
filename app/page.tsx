"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import ListingCard from "@/components/ListingCard";
import SafetyNote from "@/components/SafetyNote";

export default function HomePage() {
  const { listings } = useApp();
  const latest = listings.slice(0, 4);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero */}
      <section className="card p-6 sm:p-10 bg-gradient-to-br from-white to-brand-50 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-brand-100/60 rounded-full blur-3xl" aria-hidden />
        <div className="absolute -right-20 bottom-0 text-7xl sm:text-9xl opacity-10" aria-hidden>
          ✈️
        </div>
        <div className="relative">
          <span className="chip-amber mb-3">MVP / wersja społecznościowa</span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-brand-900 leading-tight">
            Znajdź lot, dołącz do załogi <br className="hidden sm:block" />
            albo pomóż na lotnisku.
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 max-w-xl">
            Nalotini to tablica ogłoszeń społeczności lotniczej. Łączymy ludzi,
            którzy mają wolne miejsce w samolocie, robią nalot, organizują
            wyjazd na lotnisko albo szukają pomocy przy szybowcach. Bez
            sprzedaży biletów i prowizji.
          </p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Link href="/ogloszenia?cat=Szukam+lotu" className="btn-primary">
              🔍 Szukam lotu
            </Link>
            <Link
              href="/dodaj?type=Mam+wolne+miejsce"
              className="btn-secondary"
            >
              🛩️ Mam wolne miejsce
            </Link>
            <Link href="/dodaj" className="btn-accent">
              ➕ Dodaj ogłoszenie
            </Link>
            <Link href="/ogloszenia" className="btn-secondary">
              📋 Zobacz ogłoszenia
            </Link>
          </div>
        </div>
      </section>

      {/* Najnowsze */}
      <section>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-900">
            Najnowsze ogłoszenia
          </h2>
          <Link
            href="/ogloszenia"
            className="text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            Wszystkie →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {latest.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* Jak to działa */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            icon: "📝",
            title: "Dodaj lub przeglądaj",
            text: "Wystaw ogłoszenie albo znajdź coś, co pasuje do twojego planu.",
          },
          {
            icon: "🤝",
            title: "Poproś o miejsce",
            text: "Wyślij prośbę autorowi. Bez płatności, bez prowizji, bez zobowiązań.",
          },
          {
            icon: "✈️",
            title: "Spotkajcie się i lećcie",
            text: "Szczegóły i ewentualny udział w kosztach ustalacie bezpośrednio.",
          },
        ].map((s) => (
          <div key={s.title} className="card p-5">
            <div className="text-2xl mb-2" aria-hidden>
              {s.icon}
            </div>
            <h3 className="font-semibold text-brand-900">{s.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{s.text}</p>
          </div>
        ))}
      </section>

      <SafetyNote variant="warning">
        Nalotini jest tablicą ogłoszeń społeczności lotniczej. Nie sprzedajemy
        biletów, nie obsługujemy płatności i nie organizujemy lotów.
        Rezerwacja jest zgłoszeniem chęci udziału, nie gwarancją wykonania
        lotu. <Link href="/bezpieczenstwo" className="underline font-medium">Przeczytaj zasady bezpieczeństwa →</Link>
      </SafetyNote>
    </div>
  );
}

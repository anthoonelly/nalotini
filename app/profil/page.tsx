"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import Avatar from "@/components/Avatar";

export default function ProfilePage() {
  const { currentUser, listings, reservations } = useApp();

  const myListings = listings.filter((l) => l.authorId === currentUser.id);
  const completed = reservations.filter(
    (r) => r.userId === currentUser.id && r.status === "accepted"
  );

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="card p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <Avatar name={currentUser.name} size="lg" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-brand-900">{currentUser.name}</h1>
            <p className="text-sm text-slate-600">
              {currentUser.role} · 📍 {currentUser.location}
            </p>
          </div>
        </div>

        {currentUser.bio && (
          <p className="text-sm text-slate-700 mt-4">{currentUser.bio}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-sm">
          {currentUser.aviationExperience && (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                Doświadczenie lotnicze
              </p>
              <p className="text-brand-900 mt-0.5">
                {currentUser.aviationExperience}
              </p>
            </div>
          )}
          {currentUser.favoriteAirports && currentUser.favoriteAirports.length > 0 && (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                Ulubione lotniska
              </p>
              <p className="text-brand-900 mt-0.5">
                {currentUser.favoriteAirports.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Stat label="Aktywne ogłoszenia" value={myListings.length} />
        <Stat label="Zakończone aktywności" value={completed.length} />
        <Stat label="Rola w społeczności" value={currentUser.role} />
      </div>

      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-brand-900">Ustawienia widoczności</h2>
        <p className="text-sm text-slate-600">
          Domyślnie pokazujemy tylko twoje imię i rolę. Nigdy nie pokazujemy
          publicznie numeru telefonu ani e-maila.
        </p>
        <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
          <li>Imię — widoczne w ogłoszeniach, w których uczestniczysz.</li>
          <li>Rola — widoczna w ogłoszeniach.</li>
          <li>Lokalizacja — orientacyjna, miasto.</li>
          <li>Numer telefonu i e-mail — niewidoczne.</li>
        </ul>
      </div>

      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-brand-900">Twoje akcje</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link href="/moje-ogloszenia" className="btn-secondary">
            🛫 Moje ogłoszenia
          </Link>
          <Link href="/moje-rezerwacje" className="btn-secondary">
            🎟️ Moje rezerwacje
          </Link>
          <Link href="/dodaj" className="btn-primary">
            ➕ Dodaj ogłoszenie
          </Link>
          <Link href="/bezpieczenstwo" className="btn-ghost">
            🛡️ Bezpieczeństwo
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
        {label}
      </p>
      <p className="text-xl font-bold text-brand-900 mt-1 capitalize">{value}</p>
    </div>
  );
}

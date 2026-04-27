"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import ListingCard from "@/components/ListingCard";
import { CATEGORIES } from "@/lib/categories";
import { Category } from "@/lib/types";

function ListingsContent() {
  const { listings } = useApp();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<Category | "Wszystkie">("Wszystkie");
  const [location, setLocation] = useState("");
  const [activityType, setActivityType] = useState("");
  const [date, setDate] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) {
      const match = CATEGORIES.find((c) => c.value === cat);
      if (match) setCategory(match.value);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (category !== "Wszystkie" && l.category !== category) return false;
      if (location) {
        const hay = `${l.startLocation} ${l.startAirport ?? ""} ${l.destinationLocation ?? ""} ${l.destinationAirport ?? ""}`.toLowerCase();
        if (!hay.includes(location.toLowerCase())) return false;
      }
      if (activityType) {
        if (!l.activityType.toLowerCase().includes(activityType.toLowerCase())) return false;
      }
      if (date) {
        if (!l.date.toLowerCase().includes(date.toLowerCase())) return false;
      }
      if (onlyAvailable && l.availableSeats <= 0) return false;
      return true;
    });
  }, [listings, category, location, activityType, date, onlyAvailable]);

  const reset = () => {
    setCategory("Wszystkie");
    setLocation("");
    setActivityType("");
    setDate("");
    setOnlyAvailable(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Ogłoszenia</h1>
        <p className="text-sm text-slate-600 mt-1">
          Przeglądaj wszystkie aktywne ogłoszenia społeczności lotniczej.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 sm:p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="label">Kategoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "Wszystkie")}
              className="input"
            >
              <option value="Wszystkie">Wszystkie</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Lokalizacja / lotnisko</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="np. Warszawa, EPBC"
              className="input"
            />
          </div>
          <div>
            <label className="label">Typ aktywności</label>
            <input
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              placeholder="np. lot widokowy"
              className="input"
            />
          </div>
          <div>
            <label className="label">Data</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="np. sobota"
              className="input"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
            />
            Tylko z wolnymi miejscami
          </label>
          <button onClick={reset} className="btn-ghost text-xs">
            Wyczyść filtry
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Znaleziono <span className="font-semibold text-brand-900">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "ogłoszenie" : "ogłoszeń"}
      </p>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          <p className="text-3xl mb-2" aria-hidden>🔍</p>
          <p className="text-sm">Brak ogłoszeń spełniających kryteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="card p-8 text-center text-slate-500 text-sm">Ładuję ogłoszenia…</div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}

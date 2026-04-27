"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import AutocompleteInput from "@/components/AutocompleteInput";
import { CATEGORIES } from "@/lib/categories";
import { POLISH_AIRFIELDS } from "@/lib/airports";
import { Listing } from "@/lib/types";

function ListingsContent() {
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<string>("Wszystkie");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) setCategory(catParam);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (category !== "Wszystkie") params.set("category", category);
        if (location) params.set("location", location);
        if (date) params.set("fromDate", date);
        if (onlyAvailable) params.set("onlyAvailable", "1");

        const res = await fetch(`/api/listings?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) {
          if (!res.ok) {
            setError(data.error || "Błąd ładowania");
          } else {
            setListings(data.listings || []);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Błąd sieci");
          setLoading(false);
        }
      }
    }
    const t = setTimeout(load, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [category, location, date, onlyAvailable]);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-brand-900">Ogłoszenia</h1>
        <p className="text-sm text-slate-600">
          Znajdź wspólny lot, ofertę miejsca lub osobę szukającą partnera w niebo.
        </p>
      </header>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="label">Kategoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option>Wszystkie</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Lokalizacja</label>
            <AutocompleteInput
              value={location}
              onChange={setLocation}
              options={POLISH_AIRFIELDS}
              placeholder="np. Warszawa"
            />
          </div>

          <div>
            <label className="label">Od daty</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={todayISO}
              className="input"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="h-4 w-4 rounded text-brand-700"
              />
              Tylko z wolnymi miejscami
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">Ładowanie ogłoszeń...</div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 text-rose-900">
          <p className="font-semibold">Nie udało się załadować ogłoszeń</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-600">
          <p className="text-3xl mb-2">🔍</p>
          <p className="font-medium">Brak ogłoszeń pasujących do filtrów</p>
          <p className="text-sm mt-1">Spróbuj zmienić kryteria wyszukiwania.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-500">Ładowanie...</div>}>
      <ListingsContent />
    </Suspense>
  );
}

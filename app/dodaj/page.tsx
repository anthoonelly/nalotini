"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { CATEGORIES } from "@/lib/categories";
import {
  Category,
  CostType,
  SettlementMethod,
} from "@/lib/types";
import SafetyNote from "@/components/SafetyNote";

const COST_TYPES: CostType[] = [
  "brak kosztów",
  "orientacyjny udział w kosztach",
  "koszt do ustalenia",
  "podział kosztów",
  "zależny od trasy/czasu/pogody",
];

const SETTLEMENT_METHODS: SettlementMethod[] = [
  "gotówka poza aplikacją",
  "do ustalenia prywatnie",
  "brak rozliczenia",
  "inne poza aplikacją",
];

export default function AddListingPage() {
  const router = useRouter();
  const { addListing } = useApp();

  const [mode, setMode] = useState<"quick" | "full">("quick");
  const [quickText, setQuickText] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "Robię nalot" as Category,
    description: "",
    activityType: "",
    startLocation: "",
    startAirport: "",
    destinationLocation: "",
    destinationAirport: "",
    date: "",
    time: "",
    totalSeats: 2,
    costAmount: "" as string,
    costCurrency: "PLN",
    costType: "orientacyjny udział w kosztach" as CostType,
    settlementMethod: "gotówka poza aplikacją" as SettlementMethod,
    requirements: "",
    organizationNotes: "",
    participantsVisibility: "tylko imię" as "publiczna" | "tylko imię" | "ukryta",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleQuickStart() {
    setForm((f) => ({
      ...f,
      description: quickText,
      title: quickText.slice(0, 60),
    }));
    setMode("full");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title || !form.startLocation || !form.date || !form.time) {
      alert("Uzupełnij tytuł, lokalizację, datę i godzinę.");
      return;
    }

    const id = addListing({
      title: form.title,
      category: form.category,
      description: form.description,
      activityType: form.activityType || form.category,
      startLocation: form.startLocation,
      startAirport: form.startAirport || undefined,
      destinationLocation: form.destinationLocation || undefined,
      destinationAirport: form.destinationAirport || undefined,
      date: form.date,
      time: form.time,
      totalSeats: Number(form.totalSeats) || 1,
      costAmount: form.costAmount ? Number(form.costAmount) : undefined,
      costCurrency: form.costAmount ? form.costCurrency : undefined,
      costType: form.costType,
      settlementMethod: form.settlementMethod,
      requirements: form.requirements || undefined,
      organizationNotes: form.organizationNotes || undefined,
      participantsVisibility: form.participantsVisibility,
    });

    router.push(`/ogloszenia/${id}`);
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Dodaj ogłoszenie</h1>
        <p className="text-sm text-slate-600 mt-1">
          Opowiedz społeczności co planujesz lub czego szukasz.
        </p>
      </div>

      {/* Tabs */}
      <div className="card p-1.5 flex gap-1.5">
        <button
          type="button"
          onClick={() => setMode("quick")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === "quick" ? "bg-brand-700 text-white" : "text-slate-600 hover:bg-brand-50"
          }`}
        >
          ⚡ Szybkie dodawanie
        </button>
        <button
          type="button"
          onClick={() => setMode("full")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === "full" ? "bg-brand-700 text-white" : "text-slate-600 hover:bg-brand-50"
          }`}
        >
          📋 Pełny formularz
        </button>
      </div>

      {mode === "quick" && (
        <div className="card p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-brand-900">Wpisz w skrócie</h2>
            <p className="text-sm text-slate-600 mt-1">
              Napisz w jednym zdaniu co planujesz. Potem przejdziemy do
              pełnego formularza i uzupełnisz brakujące pola.
            </p>
          </div>
          <textarea
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            rows={5}
            className="input resize-none"
            placeholder="W sobotę robię nalot z EPBC, mam dwa wolne miejsca, start około 10:00, orientacyjny koszt 220 zł od osoby."
          />
          <div className="flex gap-2">
            <button
              onClick={handleQuickStart}
              className="btn-primary"
              disabled={!quickText.trim()}
            >
              Przejdź do pełnego formularza →
            </button>
            <button onClick={() => setMode("full")} className="btn-ghost">
              Pominę szybkie dodawanie
            </button>
          </div>
          <SafetyNote>
            Nalotini służy do kontaktu między użytkownikami. Nie sprzedajemy
            biletów i nie pośredniczymy w rozliczeniach.
          </SafetyNote>
        </div>
      )}

      {mode === "full" && (
        <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-5">
          <Section title="Podstawowe informacje">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Typ ogłoszenia / kategoria</label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value as Category)}
                  className="input"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Typ aktywności</label>
                <input
                  value={form.activityType}
                  onChange={(e) => update("activityType", e.target.value)}
                  className="input"
                  placeholder="np. lot widokowy, nalot treningowy, skoki"
                />
              </div>
            </div>
            <div>
              <label className="label">Tytuł</label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="input"
                placeholder="np. Robię nalot z EPBC, mam dwa miejsca"
                required
              />
            </div>
            <div>
              <label className="label">Opis</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className="input resize-none"
                placeholder="Opisz krótko plan, charakter aktywności, oczekiwania."
              />
            </div>
          </Section>

          <Section title="Lokalizacja i czas">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Miejsce startu / lotnisko *</label>
                <input
                  value={form.startLocation}
                  onChange={(e) => update("startLocation", e.target.value)}
                  className="input"
                  placeholder="np. Warszawa-Babice"
                  required
                />
              </div>
              <div>
                <label className="label">Kod lotniska startu</label>
                <input
                  value={form.startAirport}
                  onChange={(e) => update("startAirport", e.target.value)}
                  className="input"
                  placeholder="np. EPBC"
                />
              </div>
              <div>
                <label className="label">Miejsce docelowe</label>
                <input
                  value={form.destinationLocation}
                  onChange={(e) => update("destinationLocation", e.target.value)}
                  className="input"
                  placeholder="opcjonalnie"
                />
              </div>
              <div>
                <label className="label">Kod lotniska docelowego</label>
                <input
                  value={form.destinationAirport}
                  onChange={(e) => update("destinationAirport", e.target.value)}
                  className="input"
                  placeholder="opcjonalnie"
                />
              </div>
              <div>
                <label className="label">Data *</label>
                <input
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="input"
                  placeholder="np. Sobota albo 15.06"
                  required
                />
              </div>
              <div>
                <label className="label">Godzina *</label>
                <input
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  className="input"
                  placeholder="np. 10:00"
                  required
                />
              </div>
            </div>
          </Section>

          <Section title="Miejsca i koszty">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label">Liczba miejsc</label>
                <input
                  type="number"
                  min={1}
                  value={form.totalSeats}
                  onChange={(e) => update("totalSeats", Number(e.target.value))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Orientacyjny koszt</label>
                <input
                  type="number"
                  min={0}
                  value={form.costAmount}
                  onChange={(e) => update("costAmount", e.target.value)}
                  className="input"
                  placeholder="np. 220"
                />
              </div>
              <div>
                <label className="label">Waluta</label>
                <select
                  value={form.costCurrency}
                  onChange={(e) => update("costCurrency", e.target.value)}
                  className="input"
                >
                  <option>PLN</option>
                  <option>EUR</option>
                  <option>USD</option>
                </select>
              </div>
              <div>
                <label className="label">Typ kosztu</label>
                <select
                  value={form.costType}
                  onChange={(e) => update("costType", e.target.value as CostType)}
                  className="input"
                >
                  {COST_TYPES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Sposób rozliczenia</label>
                <select
                  value={form.settlementMethod}
                  onChange={(e) =>
                    update("settlementMethod", e.target.value as SettlementMethod)
                  }
                  className="input"
                >
                  {SETTLEMENT_METHODS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <SafetyNote>
              Podawana kwota to orientacyjny udział w kosztach, nie cena biletu.
              Nalotini nie obsługuje płatności online ani prowizji.
            </SafetyNote>
          </Section>

          <Section title="Wymagania i organizacja">
            <div>
              <label className="label">Wymagania wobec uczestnika</label>
              <textarea
                value={form.requirements}
                onChange={(e) => update("requirements", e.target.value)}
                rows={2}
                className="input resize-none"
                placeholder="np. waga do 90 kg, doświadczenie skokowe AFF"
              />
            </div>
            <div>
              <label className="label">Informacje organizacyjne</label>
              <textarea
                value={form.organizationNotes}
                onChange={(e) => update("organizationNotes", e.target.value)}
                rows={2}
                className="input resize-none"
                placeholder="np. spotkanie 30 min przed startem, parking przed hangarem"
              />
            </div>
            <div>
              <label className="label">Widoczność uczestników</label>
              <select
                value={form.participantsVisibility}
                onChange={(e) =>
                  update(
                    "participantsVisibility",
                    e.target.value as "publiczna" | "tylko imię" | "ukryta"
                  )
                }
                className="input"
              >
                <option value="publiczna">Publiczna (imię i rola)</option>
                <option value="tylko imię">Tylko imię</option>
                <option value="ukryta">Ukryta (tylko ty widzisz)</option>
              </select>
            </div>
          </Section>

          <SafetyNote variant="warning">
            Publikując ogłoszenie potwierdzasz, że nie sprzedajesz biletu ani
            usługi przewozu. Nalotini jest tablicą społecznościową, kwoty mają
            charakter orientacyjnego udziału w kosztach, a rozliczenie odbywa
            się poza aplikacją.
          </SafetyNote>

          <div className="flex flex-col sm:flex-row gap-2">
            <button type="submit" className="btn-primary flex-1">
              Opublikuj ogłoszenie
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Anuluj
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-brand-800 uppercase tracking-wide">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

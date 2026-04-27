"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CATEGORIES, ACTIVITY_SUGGESTIONS, categoryEmoji } from "@/lib/categories";
import { POLISH_AIRFIELDS } from "@/lib/airports";
import { Category } from "@/lib/types";
import SafetyNote from "@/components/SafetyNote";
import AutocompleteInput from "@/components/AutocompleteInput";
import DateTimePicker from "@/components/DateTimePicker";

type Tab = "offer" | "request";

export default function AddListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [tab, setTab] = useState<Tab>("offer");
  const [category, setCategory] = useState<Category>("Budowa nalotu");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activityType, setActivityType] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightTime, setFlightTime] = useState("");
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [totalSeats, setTotalSeats] = useState<number>(1);
  const [costType, setCostType] = useState<"free" | "fixed">("fixed");
  const [costAmount, setCostAmount] = useState<number | "">("");
  const [settlementMethod, setSettlementMethod] = useState("Do uzgodnienia");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const activitySuggestions = ACTIVITY_SUGGESTIONS[category] || [];

  // Auto-suggest title based on category and activity
  useEffect(() => {
    if (title) return;
    if (tab === "offer" && activityType) {
      setTitle(`${activityType} — wolne miejsce`);
    }
  }, [activityType, tab]); // eslint-disable-line

  if (status === "loading") {
    return <div className="text-center py-12 text-slate-500">Ładowanie...</div>;
  }

  if (!session) {
    return (
      <div className="card p-6 text-center">
        <p className="font-semibold text-brand-900">Zaloguj się, aby dodać ogłoszenie</p>
        <Link href="/logowanie?callbackUrl=/dodaj" className="btn btn-primary mt-3 inline-block">
          Przejdź do logowania
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Walidacja: dla "Inne" wymagamy wpisanego rodzaju aktywności
    if (category === "Inne" && (!activityType || activityType.trim().length < 3)) {
      setError('Dla kategorii Inne musisz wpisać o co chodzi (rodzaj aktywności).');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: tab,
          category,
          title,
          description,
          activityType: activityType || null,
          flightDate: flightDate || null,
          flightTime: flightTime || null,
          location,
          destination: destination || null,
          totalSeats: tab === "offer" ? totalSeats : null,
          availableSeats: tab === "offer" ? totalSeats : null,
          costType,
          costAmount: costType === "free" ? null : costAmount === "" ? null : Number(costAmount),
          settlementMethod: costType === "free" ? null : settlementMethod,
          visibility: "public",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Błąd zapisu");
        setSubmitting(false);
        return;
      }

      const listing = data.listing;
      if (listing.status === "pending_review") {
        alert(
          'Ogłoszenie zostało dodane, ale wymaga weryfikacji moderatora przed publikacją. Sprawdź status w "Moje ogłoszenia".'
        );
        router.push("/moje-ogloszenia");
      } else {
        router.push(`/ogloszenia/${listing.id}`);
      }
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Błąd sieci");
      setSubmitting(false);
    }
  }

  const isOther = category === "Inne";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-brand-900">Dodaj ogłoszenie</h1>
        <p className="text-sm text-slate-600">
          Niekomercyjnie. Bez prowizji. Wszelkie rozliczenia poza aplikacją.
        </p>
      </header>

      {/* Tabs - offer vs request */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTab("offer")}
          className={`p-4 rounded-2xl text-left transition border-2 ${
            tab === "offer"
              ? "border-brand-700 bg-brand-50 text-brand-900"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          }`}
        >
          <div className="text-2xl">✈️</div>
          <div className="font-semibold mt-1">Oferuję miejsce</div>
          <p className="text-xs text-slate-500 mt-0.5">Mam wolne miejsce w swoim locie</p>
        </button>
        <button
          type="button"
          onClick={() => setTab("request")}
          className={`p-4 rounded-2xl text-left transition border-2 ${
            tab === "request"
              ? "border-brand-700 bg-brand-50 text-brand-900"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          }`}
        >
          <div className="text-2xl">🙋</div>
          <div className="font-semibold mt-1">Szukam miejsca</div>
          <p className="text-xs text-slate-500 mt-0.5">Chcę polecieć z kimś, kto leci w moją stronę</p>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Section: Co? */}
        <Section title="Co?" subtitle="Rodzaj lotu i opis">
          <div>
            <label className="label">Kategoria</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCategory(c);
                    if (c !== "Inne") setActivityType("");
                  }}
                  className={`p-3 rounded-xl text-sm transition border flex items-center gap-2 ${
                    category === c
                      ? "border-brand-700 bg-brand-50 text-brand-900 font-medium"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="text-lg">{categoryEmoji(c)}</span>
                  <span>{c}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="activity">
              {isOther ? "Opisz krótko, o co chodzi" : "Rodzaj aktywności"}{" "}
              {isOther ? (
                <span className="text-rose-600 font-normal">(wymagane)</span>
              ) : (
                <span className="text-slate-400 font-normal">(opcjonalnie)</span>
              )}
            </label>
            <input
              id="activity"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="input"
              placeholder={isOther ? "np. Wymiana doświadczeń lotniczych" : "np. Skok w tandemie"}
              required={isOther}
              minLength={isOther ? 3 : 0}
            />
            {!isOther && activitySuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {activitySuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActivityType(s)}
                    className="text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 hover:bg-brand-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="label" htmlFor="title">Tytuł ogłoszenia</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
              minLength={5}
              maxLength={200}
              placeholder="np. Wolne miejsce w Cessnie 172, lot widokowy nad Mazury"
            />
          </div>

          <div>
            <label className="label" htmlFor="desc">Opis</label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              rows={5}
              required
              minLength={20}
              maxLength={5000}
              placeholder="Opisz szczegóły: planowana trasa, doświadczenie, czego oczekujesz, itp."
            />
            <p className="text-xs text-slate-500 mt-1">
              {description.length} / 5000 znaków
            </p>
          </div>
        </Section>

        {/* Section: Kiedy? */}
        <Section title="Kiedy?" subtitle="Termin lotu lub spotkania">
          <DateTimePicker
            date={flightDate}
            time={flightTime}
            onDateChange={setFlightDate}
            onTimeChange={setFlightTime}
            minDate={todayISO}
          />
        </Section>

        {/* Section: Skąd, dokąd? */}
        <Section title="Skąd, dokąd?" subtitle="Lotniska / lądowiska">
          <div>
            <label className="label" htmlFor="loc">Lotnisko startu</label>
            <AutocompleteInput
              id="loc"
              value={location}
              onChange={setLocation}
              options={POLISH_AIRFIELDS}
              required
              placeholder="np. Aeroklub Warszawski - Babice"
            />
          </div>

          <div>
            <label className="label" htmlFor="dest">
              Lotnisko docelowe <span className="text-slate-400 font-normal">(opcjonalnie)</span>
            </label>
            <AutocompleteInput
              id="dest"
              value={destination}
              onChange={setDestination}
              options={POLISH_AIRFIELDS}
              placeholder="Zostaw puste, jeśli wracasz na to samo lotnisko"
            />
          </div>
        </Section>

        {/* Section: Miejsca i koszty (only for offer) */}
        {tab === "offer" && (
          <Section title="Ile miejsc i koszty" subtitle="Liczba wolnych miejsc i sposób rozliczenia">
            <div>
              <label className="label">Liczba wolnych miejsc</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTotalSeats(Math.max(1, totalSeats - 1))}
                  className="h-10 w-10 rounded-lg border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                  className="input text-center w-20"
                />
                <button
                  type="button"
                  onClick={() => setTotalSeats(Math.min(20, totalSeats + 1))}
                  className="h-10 w-10 rounded-lg border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="label">Rodzaj kosztów</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCostType("fixed")}
                  className={`p-3 rounded-xl text-sm transition border ${
                    costType === "fixed"
                      ? "border-brand-700 bg-brand-50 text-brand-900 font-medium"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  💸 Stała kwota / osoba
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCostType("free");
                    setCostAmount("");
                  }}
                  className={`p-3 rounded-xl text-sm transition border ${
                    costType === "free"
                      ? "border-brand-700 bg-brand-50 text-brand-900 font-medium"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  🆓 Bez kosztów
                </button>
              </div>
            </div>

            {costType === "fixed" && (
              <>
                <div>
                  <label className="label" htmlFor="amount">
                    Kwota (PLN / osoba)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    min={0}
                    max={10000}
                    value={costAmount}
                    onChange={(e) => setCostAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="input"
                    placeholder="np. 250"
                  />
                </div>

                <div>
                  <label className="label">Sposób rozliczenia</label>
                  <select
                    value={settlementMethod}
                    onChange={(e) => setSettlementMethod(e.target.value)}
                    className="input"
                  >
                    <option>Do uzgodnienia</option>
                    <option>Gotówka na miejscu</option>
                    <option>Przelew po locie</option>
                  </select>
                </div>
              </>
            )}
          </Section>
        )}

        <SafetyNote variant="info">
          Po dodaniu ogłoszenia jest ono automatycznie sprawdzane przez system
          moderacji. Ogłoszenia zawierające komercyjną sprzedaż, próby wymiany
          kontaktu poza platformą lub niebezpieczne praktyki trafią do ręcznej
          weryfikacji moderatora.
        </SafetyNote>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Link href="/" className="btn btn-ghost flex-1 text-center">
            Anuluj
          </Link>
          <button type="submit" className="btn btn-primary flex-[2]" disabled={submitting}>
            {submitting ? "Publikuję..." : "Opublikuj ogłoszenie"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
      <div>
        <h2 className="font-semibold text-brand-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

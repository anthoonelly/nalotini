"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CATEGORIES, ACTIVITY_SUGGESTIONS } from "@/lib/categories";
import { POLISH_AIRFIELDS } from "@/lib/airports";
import { Category } from "@/lib/types";
import SafetyNote from "@/components/SafetyNote";

type Tab = "offer" | "request";

export default function AddListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [tab, setTab] = useState<Tab>("offer");
  const [category, setCategory] = useState<Category>("Lot widokowy");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activityType, setActivityType] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightTime, setFlightTime] = useState("");
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [totalSeats, setTotalSeats] = useState<number>(1);
  const [costType, setCostType] = useState("share");
  const [costAmount, setCostAmount] = useState<number | "">("");
  const [settlementMethod, setSettlementMethod] = useState("Do uzgodnienia");
  const [visibility, setVisibility] = useState("public");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const activitySuggestions = ACTIVITY_SUGGESTIONS[category] || [];

  // Auto-suggest title based on category and activity
  useEffect(() => {
    if (title) return; // don't overwrite user's input
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
          costAmount: costAmount === "" ? null : Number(costAmount),
          settlementMethod,
          visibility,
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
          "Ogłoszenie zostało dodane, ale wymaga weryfikacji moderatora przed publikacją. Otrzymasz powiadomienie po jego zatwierdzeniu."
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
          <p className="text-xs text-slate-500 mt-0.5">
            Mam wolne miejsce w swoim locie
          </p>
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
          <p className="text-xs text-slate-500 mt-0.5">
            Chcę polecieć z kimś, kto leci w moją stronę
          </p>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Section: Co? */}
        <Section title="Co?" subtitle="Rodzaj lotu i opis">
          <div>
            <label className="label">Kategoria</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCategory(c);
                    setActivityType("");
                  }}
                  className={`p-2.5 rounded-xl text-sm transition border ${
                    category === c
                      ? "border-brand-700 bg-brand-50 text-brand-900 font-medium"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="activity">
              Rodzaj aktywności <span className="text-slate-400 font-normal">(opcjonalnie)</span>
            </label>
            <input
              id="activity"
              list="activity-suggestions"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="input"
              placeholder="np. Lot panoramiczny nad miastem"
            />
            <datalist id="activity-suggestions">
              {activitySuggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            {activitySuggestions.length > 0 && (
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
              placeholder="Opisz lot: planowana trasa, doświadczenie, czego oczekujesz, itp."
            />
            <p className="text-xs text-slate-500 mt-1">
              {description.length} / 5000 znaków
            </p>
          </div>
        </Section>

        {/* Section: Kiedy? */}
        <Section title="Kiedy?" subtitle="Termin lotu">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="date">Data</label>
              <input
                id="date"
                type="date"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                min={todayISO}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="time">
                Godzina <span className="text-slate-400 font-normal">(opcjonalnie)</span>
              </label>
              <input
                id="time"
                type="time"
                value={flightTime}
                onChange={(e) => setFlightTime(e.target.value)}
                className="input"
              />
            </div>
          </div>
        </Section>

        {/* Section: Skąd, dokąd? */}
        <Section title="Skąd, dokąd?" subtitle="Lotniska / lądowiska">
          <div>
            <label className="label" htmlFor="loc">Lotnisko startu</label>
            <input
              id="loc"
              list="airfields-from"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input"
              required
              placeholder="np. Aeroklub Warszawski - Babice (EPBC)"
              autoComplete="off"
            />
            <datalist id="airfields-from">
              {POLISH_AIRFIELDS.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="label" htmlFor="dest">
              Lotnisko docelowe <span className="text-slate-400 font-normal">(opcjonalnie)</span>
            </label>
            <input
              id="dest"
              list="airfields-to"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input"
              placeholder="Zostaw puste, jeśli lot widokowy z powrotem na to samo lotnisko"
              autoComplete="off"
            />
            <datalist id="airfields-to">
              {POLISH_AIRFIELDS.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
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
                {[
                  { v: "free", l: "Bez kosztów" },
                  { v: "share", l: "Podział kosztów" },
                  { v: "fuel", l: "Tylko paliwo" },
                  { v: "fixed", l: "Stała kwota / osoba" },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setCostType(o.v)}
                    className={`p-2.5 rounded-xl text-sm transition border ${
                      costType === o.v
                        ? "border-brand-700 bg-brand-50 text-brand-900 font-medium"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>

            {(costType === "share" || costType === "fuel" || costType === "fixed") && (
              <div>
                <label className="label" htmlFor="amount">
                  Szacowana kwota (PLN / osoba){" "}
                  <span className="text-slate-400 font-normal">(opcjonalnie)</span>
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
            )}

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
                <option>Bez kosztów</option>
              </select>
            </div>
          </Section>
        )}

        {/* Visibility */}
        <Section title="Widoczność" subtitle="Kto może zobaczyć ogłoszenie">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVisibility("public")}
              className={`p-3 rounded-xl text-left text-sm transition border ${
                visibility === "public"
                  ? "border-brand-700 bg-brand-50 text-brand-900 font-medium"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <div className="font-semibold">🌍 Publiczne</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Widoczne dla wszystkich
              </div>
            </button>
            <button
              type="button"
              onClick={() => setVisibility("verified_only")}
              className={`p-3 rounded-xl text-left text-sm transition border ${
                visibility === "verified_only"
                  ? "border-brand-700 bg-brand-50 text-brand-900 font-medium"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <div className="font-semibold">🔒 Tylko zalogowani</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Tylko osoby z kontem
              </div>
            </button>
          </div>
        </Section>

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

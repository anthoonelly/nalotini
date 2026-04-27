import Link from "next/link";

const RULES = [
  "Nalotini jest tablicą ogłoszeń społeczności lotniczej.",
  "Nalotini nie jest linią lotniczą.",
  "Nalotini nie jest biurem podróży.",
  "Nalotini nie organizuje lotów.",
  "Nalotini nie sprzedaje biletów.",
  "Nalotini nie obsługuje płatności.",
  "Nalotini nie pobiera prowizji.",
  "Nalotini nie gwarantuje wykonania lotu.",
  "Rezerwacja miejsca nie oznacza gwarancji transportu.",
  "Lot może zostać odwołany z powodów pogodowych, technicznych, bezpieczeństwa lub organizacyjnych.",
  "Pilot odpowiada za decyzje operacyjne.",
  "Uczestnik powinien samodzielnie zweryfikować szczegóły aktywności.",
  "Kwoty podane w ogłoszeniach oznaczają orientacyjny udział w kosztach, a nie sprzedaż biletu.",
  "Rozliczenie odbywa się bezpośrednio między użytkownikami poza aplikacją.",
];

export default function SafetyPage() {
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Bezpieczeństwo</h1>
        <p className="text-sm text-slate-600 mt-1">
          Krótkie zasady, które wyjaśniają, czym jest i czym nie jest Nalotini.
        </p>
      </div>

      <div className="card p-6 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden>
            🛡️
          </span>
          <div>
            <h2 className="font-semibold text-brand-900">
              Jak działa Nalotini
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              To miejsce, w którym społeczność lotnicza spotyka się, dzieli
              wolnymi miejscami i wspólnie planuje wyjazdy. Cała aktywność
              odbywa się między użytkownikami.
            </p>
          </div>
        </div>
      </div>

      <ol className="space-y-2.5">
        {RULES.map((r, i) => (
          <li key={i} className="card p-4 flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <p className="text-sm text-slate-800 leading-relaxed">{r}</p>
          </li>
        ))}
      </ol>

      <div className="card p-5 bg-amber-50 border-amber-100">
        <h2 className="font-semibold text-amber-900 mb-1.5">Pamiętaj</h2>
        <p className="text-sm text-amber-900/90 leading-relaxed">
          Jeżeli widzisz ogłoszenie, które wygląda jak sprzedaż biletu albo
          komercyjny przewóz, użyj funkcji „Zgłoś ogłoszenie” w widoku
          szczegółów. Pomagasz nam dbać o bezpieczeństwo i zgodność społeczności
          z zasadami platformy.
        </p>
      </div>

      <div className="text-center pt-2">
        <Link href="/ogloszenia" className="btn-primary">
          Wróć do ogłoszeń
        </Link>
      </div>
    </div>
  );
}

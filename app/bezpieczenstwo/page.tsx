import Link from "next/link";
import SafetyNote from "@/components/SafetyNote";

const RULES = [
  {
    title: "Nalotini to platforma niekomercyjna",
    text: "Ogłoszenia dotyczą wspólnych lotów i podziału kosztów — nie sprzedaży biletów ani usług komercyjnych. Jeśli widzisz takie ogłoszenie, zgłoś je.",
  },
  {
    title: "Brak prowizji i płatności online",
    text: "Nie pobieramy żadnych prowizji. Wszelkie rozliczenia (np. podział paliwa, opłat lotniskowych) odbywają się bezpośrednio między autorem a pasażerem, poza aplikacją.",
  },
  {
    title: "Sprawdź uprawnienia i dokumenty pilota",
    text: "Przed lotem upewnij się, że pilot posiada ważną licencję, badania lotniczo-lekarskie i ubezpieczenie OC. Możesz prosić o numer licencji.",
  },
  {
    title: "Nie ufaj zbyt dobrym ofertom",
    text: "Bardzo niskie lub bardzo wysokie ceny mogą sygnalizować nieuczciwą ofertę. W razie wątpliwości skontaktuj się z innymi członkami społeczności.",
  },
  {
    title: "Komunikacja przez naszą platformę",
    text: "Pierwszy kontakt prowadź przez wiadomości w Nalotini. Pozwala to nam reagować w razie zgłoszenia. Próby przeniesienia rozmowy gdzie indziej traktuj z ostrożnością.",
  },
  {
    title: "Chroń swoje dane osobowe",
    text: "Nie podawaj numeru PESEL, danych dowodu, danych kart płatniczych. Telefon udostępniaj dopiero po akceptacji rezerwacji.",
  },
  {
    title: "Spotkanie zawsze na lotnisku / lądowisku",
    text: "Spotkania umawiajcie wyłącznie w miejscu startu lotu — nigdy w prywatnych lokalizacjach.",
  },
  {
    title: "Lot nie odbędzie się przy złej pogodzie",
    text: "Decyzję o locie podejmuje pilot. Bezpieczeństwo zawsze ma priorytet — odwołanie lotu z powodu warunków atmosferycznych jest normalne i nie podlega żadnym karom.",
  },
  {
    title: "Zabieraj tylko to, co dozwolone",
    text: "Pasażer ma obowiązek przestrzegać zasad bezpieczeństwa i instrukcji pilota. Nie wnoś rzeczy zabronionych ani nie przekraczaj limitu wagi bagażu.",
  },
  {
    title: "Ubezpieczenie",
    text: "Standardowe ubezpieczenie OC pilota nie zawsze pokrywa pasażera. Rozważ wykupienie osobistego ubezpieczenia NNW na czas lotu.",
  },
  {
    title: "Nigdy pod wpływem",
    text: "Bezwzględny zakaz lotów po alkoholu i innych substancjach. Jeśli zauważysz coś niepokojącego u pilota lub pasażera — odwołaj lot.",
  },
  {
    title: "Zgłaszaj nadużycia",
    text: "Każde podejrzane ogłoszenie możesz zgłosić moderatorowi przyciskiem Zgłoś. Trafia ono do ręcznej weryfikacji.",
  },
  {
    title: "Twoja odpowiedzialność",
    text: "Nalotini jest platformą łączącą ludzi — nie organizuje lotów ani nie weryfikuje ich legalności. Każdy uczestnik odpowiada za swoje decyzje.",
  },
  {
    title: "Bądź dobrym członkiem społeczności",
    text: "Pisz uprzejmie, odpowiadaj na prośby o miejsce, anuluj rezerwacje z odpowiednim wyprzedzeniem. Lotnictwo to mała społeczność — reputacja jest na wagę złota.",
  },
];

export default function SafetyPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-brand-900">Bezpieczeństwo i zasady</h1>
        <p className="text-sm text-slate-600 mt-1">
          14 najważniejszych reguł, które pomagają nam latać razem bezpiecznie i uczciwie.
        </p>
      </header>

      <SafetyNote variant="warning">
        Nalotini nie pośredniczy w sprzedaży biletów i nie ponosi odpowiedzialności
        za przebieg lotów. Zawsze stosuj zdrowy rozsądek i przepisy lotnicze.
      </SafetyNote>

      <ol className="space-y-3">
        {RULES.map((r, i) => (
          <li key={i} className="card p-4 sm:p-5">
            <div className="flex gap-3">
              <span className="h-8 w-8 shrink-0 rounded-full bg-brand-700 text-white font-bold text-sm flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <h2 className="font-semibold text-brand-900">{r.title}</h2>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">{r.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="card p-5 text-center">
        <p className="text-sm text-slate-700">
          Masz pytanie lub chcesz zgłosić problem? Zgłoś konkretne ogłoszenie z poziomu jego strony lub napisz do moderatora.
        </p>
        <Link href="/ogloszenia" className="btn btn-primary mt-3 inline-block">
          Wracam do ogłoszeń
        </Link>
      </div>
    </div>
  );
}

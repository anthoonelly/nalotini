# ✈️ Nalotini — MVP

Aplikacja webowa typu **tablica ogłoszeń społeczności lotniczej**. Działa jak BlaBlaCar, ale dla lotnictwa rekreacyjnego, sportowego i społecznościowego. Bez płatności online, bez prowizji, bez sprzedaży biletów.

> **Status:** MVP / prototyp — projekt Next.js gotowy do uruchomienia lokalnie i jednoklikowego deploymentu na Vercel. Dane są w pamięci aplikacji (mock + local state), więc znikają po odświeżeniu — to świadoma decyzja na ten etap.

---

## 🚀 Uruchomienie lokalnie

Wymagania: **Node.js 18+** oraz `npm`.

```bash
npm install
npm run dev
```

Następnie otwórz w przeglądarce:

```
http://localhost:3000
```

## 🌐 Wdrożenie na Vercel

1. Utwórz repozytorium na GitHub i wgraj projekt:

```bash
git init
git add .
git commit -m "Initial Nalotini MVP"
git branch -M main
git remote add origin https://github.com/<twój-login>/nalotini.git
git push -u origin main
```

2. Wejdź na [vercel.com/new](https://vercel.com/new), zaimportuj repo i kliknij **Deploy**.

Vercel automatycznie wykryje Next.js. Nie trzeba konfigurować zmiennych środowiskowych ani niczego ręcznie.

---

## 📁 Struktura projektu

```
nalotini/
├── app/
│   ├── layout.tsx                   # root layout + provider + nawigacja
│   ├── page.tsx                     # strona główna
│   ├── globals.css                  # Tailwind + style komponentów
│   ├── ogloszenia/
│   │   ├── page.tsx                 # lista + filtry
│   │   └── [id]/page.tsx            # szczegóły + rezerwacja + zgłoszenie
│   ├── dodaj/page.tsx               # dodawanie (szybkie + pełny formularz)
│   ├── moje-rezerwacje/page.tsx
│   ├── moje-ogloszenia/page.tsx     # akceptacja/odrzucenie próśb
│   ├── wiadomosci/page.tsx
│   ├── profil/page.tsx
│   └── bezpieczenstwo/page.tsx
├── components/
│   ├── Navbar.tsx                   # górna nawigacja
│   ├── BottomNav.tsx                # dolna nawigacja na mobile
│   ├── ListingCard.tsx
│   ├── CategoryBadge.tsx
│   ├── Avatar.tsx
│   ├── Modal.tsx
│   ├── ReservationModal.tsx
│   ├── ReportModal.tsx
│   └── SafetyNote.tsx
├── lib/
│   ├── types.ts                     # wszystkie typy TS
│   ├── mockData.ts                  # 10 ogłoszeń + użytkownicy + wiadomości
│   ├── categories.ts                # 10 kategorii z emoji
│   └── store.tsx                    # React Context — cała logika
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── postcss.config.js
```

---

## 🧠 Co już działa

- Strona główna z hasłem i CTA.
- Lista ogłoszeń z filtrami (kategoria, lokalizacja, typ aktywności, data, „tylko z wolnymi miejscami”).
- Szczegóły ogłoszenia: pełny widok z autorem, trasą, kosztami, opisem, wymaganiami, uczestnikami, akcjami.
- Dodawanie ogłoszenia w dwóch trybach: **szybki** (jedno pole tekstowe) i **pełny formularz**.
- Rezerwacja miejsca przez modal z wiadomością do autora.
- Akceptacja / odrzucenie zgłoszeń przez autora w „Moje ogłoszenia”.
- **Po akceptacji** liczba wolnych miejsc się zmniejsza, a użytkownik dołącza do listy uczestników.
- „Moje rezerwacje” z możliwością anulowania i wejścia w rozmowę.
- Wiadomości — lista rozmów, treść powiązana z ogłoszeniem, wysyłanie wiadomości.
- Profil użytkownika z polityką widoczności (imię + rola).
- Modal „Zgłoś ogłoszenie” z 7 kategoriami zgłoszeń.
- Strona „Bezpieczeństwo” z 14-punktowym manifestem.
- Mobile-first UI, dolna nawigacja, dostępne fokusy klawiatury.

---

## 🎭 Co jest zamockowane

- **Brak prawdziwego logowania.** Aktualny użytkownik to `Tomek` zdefiniowany w `lib/mockData.ts` (`CURRENT_USER`).
- **Brak backendu.** Cały stan żyje w `React Context` (`lib/store.tsx`). Po odświeżeniu strony wraca do mocków. To zgodne z założeniem MVP.
- **Wiadomości** są w pamięci. Wysyłanie działa — ale nie istnieje real-time ani powiadomienia.
- **Zgłoszenia ogłoszeń** są zapisywane lokalnie i pokazują tylko „dziękujemy”.
- **Liczba miejsc** zmienia się tylko po akceptacji przez autora — zgodnie ze specyfikacją.
- **Parser tekstu** w trybie szybkiego dodawania kopiuje treść do opisu i tytułu — bez prawdziwego AI.

---

## 🧪 Najszybszy scenariusz testowy

1. Otwórz `/ogloszenia` → wybierz dowolne ogłoszenie → **Poproś o miejsce** → wyślij prośbę.
2. Wejdź na `/moje-rezerwacje` — zobaczysz status „Oczekuje na akceptację”.
3. Aby zobaczyć drugą stronę, dodaj **własne** ogłoszenie przez `/dodaj`. Wtedy `Tomek` jest jego autorem.
4. Wejdź na `/moje-ogloszenia` — twoje nowe ogłoszenie. Aby je przetestować z prośbą, najpierw poproś o miejsce w innym ogłoszeniu cudzego autora albo zmień `currentUser` w `lib/mockData.ts`, żeby imitować innego użytkownika.

---

## 🔭 Sugestie kolejnych kroków

1. **Persystencja w `localStorage`** — opakować `useState` w `useReducer` + middleware do zapisu, żeby dane przetrwały refresh.
2. **Prawdziwy backend** — najprościej Supabase albo Vercel Postgres + Drizzle/Prisma. Schemat już masz w `lib/types.ts`.
3. **Logowanie** — Auth.js (NextAuth) z magic link lub OAuth.
4. **Powiadomienia e-mail** — np. Resend, gdy autor dostanie nową prośbę.
5. **Mapy** — Mapbox / Leaflet do pokazania lotnisk na mapie.
6. **Walidacja formularza** — Zod + react-hook-form.
7. **Strona statycznych aeroklubów / lotnisk** — autouzupełnianie kodów ICAO.
8. **i18n** — `next-intl` jeśli kiedyś dodasz angielski.

---

## 🚦 Filozofia językowa (spójność słownictwa)

W całej aplikacji używane są tylko sformułowania zgodne z manifestem:

- ✅ ogłoszenie, wolne miejsce, **poproś o miejsce**, **udział w kosztach**, **rozliczenie poza aplikacją**, **napisz do autora**.
- ❌ kup bilet, sprzedaj miejsce, opłać lot, gwarantowany transport, przewóz pasażerski.

Kod komponentów (`ReservationModal`, `ListingCard`, `SafetyNote`) konsekwentnie tę zasadę realizuje.

---

Powodzenia z projektem! 🛫

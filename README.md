# Nalotini

Społecznościowa tablica ogłoszeń lotnictwa rekreacyjnego — wspólne loty, podział kosztów, brak prowizji.

Wersja produkcyjna: prawdziwe konta użytkowników, baza danych, panel administratora i automatyczna moderacja ogłoszeń.

## 🚀 Wdrożenie na Vercel — krok po kroku

**Cała konfiguracja odbywa się przez przeglądarkę. Nie musisz instalować Node.js ani uruchamiać terminala.**

### Krok 1 — Wgraj projekt na GitHub

1. Wejdź na [github.com/new](https://github.com/new) i utwórz puste repo (np. `nalotini`)
2. Rozpakuj `nalotini.zip` na komputerze
3. Wejdź na adres `https://github.com/TWÓJ_LOGIN/nalotini/upload/main`
4. Przeciągnij **zawartość folderu `nalotini`** (foldery `app`, `components`, `lib`, pliki `package.json`, `README.md` itd.) — nie cały folder, tylko jego wnętrze
5. Kliknij **Commit changes**

### Krok 2 — Import projektu w Vercel

1. Wejdź na [vercel.com](https://vercel.com), zaloguj się przez GitHub
2. Kliknij **Add New… → Project**
3. Znajdź `nalotini` na liście, kliknij **Import**
4. **Nie zmieniaj domyślnej konfiguracji** — Vercel wykryje Next.js
5. **Nie klikaj jeszcze Deploy!** Najpierw musisz dodać zmienne środowiskowe (krok 4)

### Krok 3 — Podłącz bazę danych Neon Postgres

1. W panelu nowego projektu Vercel przejdź do zakładki **Storage**
2. Kliknij **Create Database** lub **Browse Marketplace**
3. Wybierz **Neon** (Postgres)
4. Kliknij **Install**, zaakceptuj warunki, wybierz region (Frankfurt dla Europy)
5. Nazwij bazę `nalotini-db`, kliknij **Create**
6. Vercel automatycznie wstrzyknie zmienne `DATABASE_URL`, `POSTGRES_URL` itd.

### Krok 4 — Dodaj pozostałe zmienne środowiskowe

W panelu projektu Vercel przejdź do **Settings → Environment Variables** i dodaj:

| Klucz | Wartość | Jak zdobyć |
|---|---|---|
| `NEXTAUTH_SECRET` | losowy ciąg 32+ znaków | Kliknij ikonę **🎲 Generate** obok pola Value w Vercel |
| `NEXTAUTH_URL` | `https://twoj-projekt.vercel.app` | Adres Twojej aplikacji (zobaczysz go po pierwszym deploy) |
| `ADMIN_EMAIL` | np. `ty@email.pl` | Email, którym będziesz logować się jako admin |
| `ADMIN_PASSWORD` | mocne hasło min. 12 znaków | Wymyśl bezpieczne hasło i zapisz |
| `ADMIN_NAME` | np. `Jan Kowalski` | Twoje imię/nick widoczne w panelu admina |

Każdą zmienną zapisuj dla wszystkich trzech środowisk: **Production, Preview, Development**.

### Krok 5 — Pierwszy deploy

1. Wróć do zakładki **Deployments**
2. Kliknij **Redeploy** na najnowszym wpisie (jeśli był failed) lub **Deploy** na ekranie importu
3. Poczekaj ~2 minuty
4. Otwórz adres `https://twoj-projekt.vercel.app`

**Pierwsze otwarcie strony automatycznie utworzy tabele w bazie i stworzy konto administratora** ze zmiennych `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### Krok 6 — Zaloguj się jako admin

1. Wejdź na `/logowanie`
2. Wpisz `ADMIN_EMAIL` i `ADMIN_PASSWORD`
3. W menu zobaczysz link **Admin** prowadzący do panelu moderacji

🎉 **Gotowe.** Aplikacja działa produkcyjnie.

---

## 📋 Funkcje

### Dla użytkowników
- ✅ Rejestracja i logowanie (email + hasło, hashowane bcrypt)
- ✅ Przeglądanie i filtrowanie ogłoszeń (kategoria, lokalizacja, data, dostępne miejsca)
- ✅ Dodawanie ogłoszeń z autopodpowiedziami (lotniska, rodzaje aktywności, kalendarz daty)
- ✅ Prośby o miejsca w ogłoszeniach innych
- ✅ Akceptacja/odrzucenie próśb (jako autor ogłoszenia)
- ✅ Czat z autorami ogłoszeń
- ✅ Profil użytkownika z ustawieniami widoczności
- ✅ Zgłaszanie podejrzanych ogłoszeń

### Dla administratora
- ✅ **Pulpit z kluczowymi statystykami** (do weryfikacji, zgłoszenia, użytkownicy)
- ✅ **Kolejka ręcznej weryfikacji** — automatycznie oflagowane ogłoszenia trafiają tutaj
- ✅ **Moderacja ogłoszeń** — zatwierdź / odrzuć z notatką / zamknij / usuń
- ✅ **Edycja cudzych ogłoszeń** (przez API `PATCH /api/listings/[id]`)
- ✅ **Zarządzanie zgłoszeniami** użytkowników
- ✅ **Zarządzanie użytkownikami** — ban / unban / promocja na admina

### Automatyczna moderacja (cenzura)

Każde nowe ogłoszenie jest analizowane pod kątem:
- 🚫 Wulgaryzmów
- 💸 Komercyjnej sprzedaży biletów (sprzeczne z misją platformy)
- ⚠️ Wzorców scamów (zaliczki, "wpłać na konto", Western Union itp.)
- ✈️ Niebezpiecznych praktyk ("bez licencji", "bez ubezpieczenia", "akrobacje z pasażerem")
- 📞 Prób wymiany kontaktu poza platformą (numery telefonu, emaile, linki, social media w treści)
- 💰 Bardzo wysokich kwot (powyżej 5000 PLN/osoba)

**Ogłoszenia ze flagami trafiają do statusu `pending_review`** i nie są publicznie widoczne. Admin widzi je w panelu `/admin/ogloszenia?status=pending`.

Wszystkie reguły są w pliku `lib/moderation.ts` — możesz je dostosować do swoich potrzeb i zrobić commit, Vercel automatycznie zaktualizuje produkcję.

---

## 🛠 Stack technologiczny

- **Next.js 14** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS**
- **Neon Postgres** (serverless, przez Vercel Marketplace)
- **NextAuth.js** (Credentials provider, sesje JWT)
- **bcryptjs** (hashowanie haseł)

---

## 📁 Struktura projektu

```
app/
  api/                    Endpointy API
    auth/                 NextAuth + rejestracja
    listings/             CRUD ogłoszeń
    reservations/         Rezerwacje (akcept/odrzucenie/anulowanie)
    conversations/        Wiadomości
    reports/              Zgłoszenia
    admin/                Endpointy administratora
    profile/              Profil użytkownika
  admin/                  Strony panelu admina
  bezpieczenstwo/         Regulamin
  dodaj/                  Formularz dodawania ogłoszenia
  logowanie/              Logowanie
  rejestracja/            Rejestracja
  moje-ogloszenia/        Moje ogłoszenia + prośby do akceptacji
  moje-rezerwacje/        Moje prośby o miejsca
  ogloszenia/             Lista i szczegóły ogłoszeń
  profil/                 Ustawienia profilu
  wiadomosci/             Czat
  layout.tsx              Root layout (z AuthProvider)
  page.tsx                Strona główna

components/               Komponenty UI
lib/
  airports.ts             Lista lotnisk PL do autouzupełniania
  auth.ts                 Konfiguracja NextAuth
  categories.ts           Kategorie i podpowiedzi aktywności
  db.ts                   Połączenie i schemat bazy danych
  moderation.ts           Reguły automatycznej moderacji
  next-auth.d.ts          Typy NextAuth
  queries.ts              Wszystkie zapytania do bazy
  session.ts              Helpery sesji po stronie serwera
  types.ts                Typy TypeScript

middleware.ts             Ochrona tras /admin, /dodaj, /profil itp.
```

---

## ❓ Najczęstsze problemy

### „Baza danych nie jest jeszcze podłączona"

Otwórz Vercel → projekt → **Storage** → **Create Database** → wybierz **Neon**. Po utworzeniu zrób **Redeploy** w zakładce Deployments.

### Nie mogę się zalogować jako admin

1. Sprawdź, czy w **Settings → Environment Variables** masz `ADMIN_EMAIL` i `ADMIN_PASSWORD`
2. Po zmianie zmiennych zawsze rób **Redeploy**
3. Po deploy odwiedź jakąkolwiek stronę aplikacji — to wywołuje `ensureDbReady()`, który seeduje admina
4. Spróbuj zalogować się dokładnie tym emailem (małe litery, bez spacji)

### „Configuration error" przy logowaniu

Brakuje `NEXTAUTH_SECRET` lub `NEXTAUTH_URL`. Dodaj je w Vercel i zrób Redeploy.

### Chcę dodać drugie konto admina

Najprostsze: zaloguj się jako pierwszy admin → **Panel admina → Użytkownicy** → znajdź konto → kliknij **Promuj na admina**.

### Chcę zmienić logikę moderacji

Edytuj plik `lib/moderation.ts` bezpośrednio przez interfejs GitHuba (klik na plik → ikona ołówka → zapisz commit). Vercel automatycznie zrobi nowy deploy.

---

## 🌐 Własna domena

Vercel → projekt → **Settings → Domains → Add**. Wpisz domenę, dostosuj DNS u swojego rejestratora wg instrukcji Vercela.

**Pamiętaj zaktualizować `NEXTAUTH_URL` po zmianie domeny!**

---

## 🔒 Bezpieczeństwo i RODO

- Hasła są hashowane (bcrypt, salt rounds 10)
- Sesje przez JWT (bez przechowywania w bazie)
- Brak danych płatniczych (platforma niekomercyjna)
- Telefon nieobowiązkowy
- Użytkownik może w każdej chwili usunąć swoje ogłoszenia
- Admin może permanentnie usunąć konto (przez API; UI w przyszłości)

Dla pełnej zgodności z RODO uzupełnij polityką prywatności i regulaminem (kliknij plik `app/bezpieczenstwo/page.tsx` na GitHubie i edytuj).

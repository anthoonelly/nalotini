import { Category, ListingType } from "./types";

// Kategorie dla "Oferuję miejsce w locie" — konkretne loty z wolnym miejscem
export const OFFER_CATEGORIES: Category[] = [
  "Lot widokowy",
  "Lot z punktu A do punktu B",
  "Lot szkoleniowy",
  "Skok ze spadochronu",
  "Lot zapoznawczy",
  "Holowanie szybowca",
  "Inne",
];

// Kategorie dla "Szukam miejsca w locie" — szukam okazji do polecenia
export const REQUEST_CATEGORIES: Category[] = [
  "Lot widokowy",
  "Lot z punktu A do punktu B",
  "Lot szkoleniowy",
  "Skok ze spadochronu",
  "Lot zapoznawczy",
  "Holowanie szybowca",
  "Inne",
];

// Kategorie dla "Inna współpraca lotnicza" — naziemne / partnerskie
export const COLLAB_CATEGORIES: Category[] = [
  "Budowa nalotu",
  "Event lotniskowy",
  "Pomoc przy zawodach",
  "Inne",
];

// Wszystkie kategorie do filtrowania
export const ALL_CATEGORIES: Category[] = Array.from(
  new Set([...OFFER_CATEGORIES, ...REQUEST_CATEGORIES, ...COLLAB_CATEGORIES])
) as Category[];

// Kompatybilność wsteczna - alias
export const CATEGORIES = ALL_CATEGORIES;

export function getCategoriesForType(type: ListingType): Category[] {
  if (type === "offer") return OFFER_CATEGORIES;
  if (type === "request") return REQUEST_CATEGORIES;
  return COLLAB_CATEGORIES;
}

export function categoryEmoji(c: string): string {
  switch (c) {
    case "Lot widokowy":
      return "🛩️";
    case "Lot z punktu A do punktu B":
      return "🗺️";
    case "Lot szkoleniowy":
      return "🎓";
    case "Skok ze spadochronu":
      return "🪂";
    case "Lot zapoznawczy":
      return "🌟";
    case "Holowanie szybowca":
      return "🛫";
    case "Budowa nalotu":
      return "⏱️";
    case "Event lotniskowy":
      return "🎪";
    case "Pomoc przy zawodach":
      return "🏆";
    case "Inne":
      return "📋";
    // Legacy fallbacks dla starszych ogłoszeń:
    case "Skoki spadochronowe":
      return "🪂";
    case "Holowanie szybowców":
      return "🛫";
    case "Awionetka":
      return "✈️";
    case "Szybowiec":
      return "🪁";
    case "Paralotnia":
      return "🟧";
    case "Motoparalotnia":
      return "🟦";
    case "Helikopter":
      return "🚁";
    default:
      return "📋";
  }
}

// Sugestie aktywności dla każdej kategorii
export const ACTIVITY_SUGGESTIONS: Record<string, string[]> = {
  "Lot widokowy": [
    "Lot panoramiczny nad miastem",
    "Lot nad Tatry",
    "Lot nad Mazury",
    "Lot nad wybrzeże",
  ],
  "Lot z punktu A do punktu B": [
    "Wycieczka w drugą część Polski",
    "Lot weekendowy",
    "Lot zagraniczny",
    "Lot na zlot lotniczy",
  ],
  "Lot szkoleniowy": [
    "Lot nawigacyjny",
    "Trening manewrów",
    "Lot z instruktorem",
    "Trening procedur",
  ],
  "Skok ze spadochronu": [
    "Skok klasyczny",
    "Skok z 4000m",
    "Pierwszy skok w życiu",
  ],
  "Lot zapoznawczy": [
    "Pierwszy lot",
    "Lot prezent",
    "Próba samolotu",
  ],
  "Holowanie szybowca": [
    "Hol na 600m",
    "Hol na termiczny",
    "Hol na żaglowy",
  ],
  "Budowa nalotu": [
    "Wspólne nalatywanie godzin do licencji",
    "Cross-country",
    "Lot dwumiejscowy z podziałem czasu",
    "Trening na egzamin",
  ],
  "Event lotniskowy": [
    "Dni otwarte aeroklubu",
    "Piknik lotniczy",
    "Wsparcie organizacyjne zlotu",
    "Pomoc na imprezie",
  ],
  "Pomoc przy zawodach": [
    "Wolontariat na mistrzostwach",
    "Wsparcie startowe",
    "Pomoc przy lądowaniach",
  ],
  "Inne": [],
};

export function describeListingType(type: ListingType): string {
  if (type === "offer") return "Oferuje miejsce";
  if (type === "request") return "Szuka miejsca";
  return "Współpraca lotnicza";
}

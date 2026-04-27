import { Category } from "./types";

// Aktywne kategorie wybierane przy dodawaniu nowych ogłoszeń.
export const CATEGORIES: Category[] = [
  "Budowa nalotu",
  "Skoki spadochronowe",
  "Holowanie szybowców",
  "Event lotniskowy",
  "Inne",
];

export function categoryEmoji(c: string): string {
  switch (c) {
    case "Budowa nalotu":
      return "✈️";
    case "Skoki spadochronowe":
      return "🪂";
    case "Holowanie szybowców":
      return "🪶";
    case "Event lotniskowy":
      return "🎪";
    case "Inne":
      return "🌥️";
    // legacy fallbacks dla starszych ogłoszeń
    case "Lot widokowy":
      return "🛩️";
    case "Lot szkoleniowy":
      return "🎓";
    case "Lot turystyczny":
      return "🗺️";
    case "Awionetka":
      return "✈️";
    case "Szybowiec":
      return "🪶";
    case "Paralotnia":
      return "🟧";
    case "Motoparalotnia":
      return "🟦";
    case "Helikopter":
      return "🚁";
    default:
      return "🌥️";
  }
}

export const ACTIVITY_SUGGESTIONS: Record<string, string[]> = {
  "Budowa nalotu": [
    "Lot nawigacyjny",
    "Trening manewrów",
    "Nalatywanie godzin do licencji",
    "Lot z instruktorem",
    "Lot zapoznawczy",
  ],
  "Skoki spadochronowe": [
    "Skok w tandemie",
    "Skok AFF",
    "Skok klasyczny",
    "Pierwszy skok",
    "Trening formacji",
  ],
  "Holowanie szybowców": [
    "Holowanie szybowca",
    "Loty żaglowe",
    "Loty termiczne",
    "Trening przelotowy",
  ],
  "Event lotniskowy": [
    "Dni otwarte aeroklubu",
    "Piknik lotniczy",
    "Pomoc przy zlocie",
    "Pomoc przy zawodach",
    "Wolontariat na evencie",
  ],
  "Inne": [],
};

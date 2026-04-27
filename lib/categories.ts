import { Category } from "./types";

export const CATEGORIES: Category[] = [
  "Lot widokowy",
  "Skoki spadochronowe",
  "Lot szkoleniowy",
  "Lot turystyczny",
  "Awionetka",
  "Szybowiec",
  "Paralotnia",
  "Motoparalotnia",
  "Helikopter",
  "Inne",
];

export function categoryEmoji(c: Category): string {
  switch (c) {
    case "Lot widokowy":
      return "🛩️";
    case "Skoki spadochronowe":
      return "🪂";
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

export const ACTIVITY_SUGGESTIONS: Record<Category, string[]> = {
  "Lot widokowy": [
    "Lot panoramiczny nad miastem",
    "Lot nad Tatry",
    "Lot nad Mazury",
    "Lot nad wybrzeże",
  ],
  "Skoki spadochronowe": [
    "Skok w tandemie",
    "Skok AFF",
    "Skok klasyczny z 4000m",
    "Pierwszy skok",
  ],
  "Lot szkoleniowy": [
    "Lot nawigacyjny",
    "Trening manewrów",
    "Nalatywanie godzin",
    "Lot z instruktorem",
  ],
  "Lot turystyczny": [
    "Wycieczka na drugi koniec Polski",
    "Lot weekendowy",
    "Lot zagraniczny",
    "Lot na zlot lotniczy",
  ],
  "Awionetka": [
    "Lot w Cessnie 152",
    "Lot w Cessnie 172",
    "Lot w Pipistrelu",
    "Lot szkolny",
  ],
  "Szybowiec": [
    "Lot termiczny",
    "Lot żaglowy",
    "Lot przelotowy",
    "Holowanie samolotem",
  ],
  "Paralotnia": [
    "Lot termiczny",
    "Lot żaglowy nad zboczem",
    "Pierwszy lot",
    "Lot dwumiejscowy",
  ],
  "Motoparalotnia": [
    "Lot widokowy z napędem",
    "Lot poranny",
    "Lot nawigacyjny",
  ],
  "Helikopter": [
    "Lot widokowy",
    "Trening zawisu",
    "Lot panoramiczny",
  ],
  "Inne": [],
};

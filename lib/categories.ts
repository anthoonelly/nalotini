import { Category } from "./types";

export const CATEGORIES: { value: Category; emoji: string; label: string }[] = [
  { value: "Mam wolne miejsce", emoji: "🛩️", label: "Mam wolne miejsce" },
  { value: "Robię nalot", emoji: "✈️", label: "Robię nalot" },
  { value: "Szukam lotu", emoji: "🔍", label: "Szukam lotu" },
  { value: "Szukam współpasażera", emoji: "👥", label: "Szukam współpasażera" },
  { value: "Potrzebna pomoc na lotnisku", emoji: "🛠️", label: "Potrzebna pomoc na lotnisku" },
  { value: "Szybowce", emoji: "🪂", label: "Szybowce" },
  { value: "Skoki spadochronowe", emoji: "🪂", label: "Skoki spadochronowe" },
  { value: "Wydarzenie lotnicze", emoji: "🎪", label: "Wydarzenie lotnicze" },
  { value: "Wspólny wyjazd na lotnisko", emoji: "🚗", label: "Wspólny wyjazd na lotnisko" },
  { value: "Inne lotnicze", emoji: "🌤️", label: "Inne lotnicze" },
];

export function categoryEmoji(category: Category): string {
  return CATEGORIES.find((c) => c.value === category)?.emoji ?? "✈️";
}

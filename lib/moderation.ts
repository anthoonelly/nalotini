// Moderacja: analizuje treść ogłoszenia i zwraca flagi zagrożeń.
// Jeśli zwróci jakiekolwiek flagi - ogłoszenie trafia do weryfikacji ręcznej.

const PROFANITY = [
  "kurwa",
  "chuj",
  "huj",
  "pizda",
  "jebać",
  "jebac",
  "spierdalaj",
  "pierdol",
  "skurwy",
  "skurwiel",
  "cwel",
  "debil",
  "idiota",
  "kretyn",
];

const COMMERCIAL_PATTERNS = [
  "kup bilet",
  "sprzedam bilet",
  "sprzedaż biletów",
  "bilet na lot",
  "bilety na lot",
  "oferta komercyjna",
  "usługa komercyjna",
  "działalność gospodarcza",
  "faktura vat",
  "wystawiam fakturę",
];

const SCAM_PATTERNS = [
  "zaliczka",
  "przedpłata",
  "100% z góry",
  "z góry pełna kwota",
  "wpłać na konto",
  "western union",
  "blik na numer",
  "tylko kontakt telefoniczny",
  "tylko sms",
  "nie pisz tu",
  "nie kontaktuj się przez",
];

const DANGEROUS_PATTERNS = [
  "bez licencji",
  "bez uprawnień",
  "bez papierów",
  "samolot bez rejestracji",
  "bez ubezpieczenia",
  "lot z dziećmi bez fotelika",
  "akrobacje z pasażerem",
];

const CONTACT_LEAK_PATTERNS = [
  /\b\d{9}\b/, // 9-cyfrowy numer (PL)
  /\+48\s?\d{3}\s?\d{3}\s?\d{3}/,
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
  /https?:\/\/\S+/i,
  /\b(?:facebook|fb|instagram|ig|whatsapp|telegram|signal|messenger)\b/i,
];

export interface ModerationResult {
  flags: string[];
  shouldReview: boolean;
}

export function moderateText(...texts: (string | null | undefined)[]): ModerationResult {
  const corpus = texts.filter(Boolean).join(" ").toLowerCase();
  const flags: string[] = [];

  for (const word of PROFANITY) {
    if (corpus.includes(word)) {
      flags.push(`Wulgaryzm: "${word}"`);
      break;
    }
  }

  for (const pattern of COMMERCIAL_PATTERNS) {
    if (corpus.includes(pattern)) {
      flags.push(`Komercyjna sprzedaż: "${pattern}"`);
      break;
    }
  }

  for (const pattern of SCAM_PATTERNS) {
    if (corpus.includes(pattern)) {
      flags.push(`Możliwy scam: "${pattern}"`);
      break;
    }
  }

  for (const pattern of DANGEROUS_PATTERNS) {
    if (corpus.includes(pattern)) {
      flags.push(`Bezpieczeństwo: "${pattern}"`);
      break;
    }
  }

  // Wykrywanie prób obejścia czatu w aplikacji
  for (const re of CONTACT_LEAK_PATTERNS) {
    if (re.test(corpus)) {
      flags.push("Wymiana kontaktu poza platformą (telefon/email/social)");
      break;
    }
  }

  return {
    flags,
    shouldReview: flags.length > 0,
  };
}

export function moderateListing(input: {
  title: string;
  description: string;
  activityType?: string | null;
  costAmount?: number | null;
}): ModerationResult {
  const result = moderateText(input.title, input.description, input.activityType);

  // Ekstremalnie wysoka kwota - flag
  if (input.costAmount && input.costAmount > 5000) {
    result.flags.push(`Bardzo wysoki koszt: ${input.costAmount} PLN`);
    result.shouldReview = true;
  }

  return result;
}

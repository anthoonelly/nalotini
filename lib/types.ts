export type Role =
  | "pilot"
  | "pasażer"
  | "szybownik"
  | "skoczek"
  | "pomocnik"
  | "organizator"
  | "pasjonat"
  | "początkujący";

export type Category =
  | "Mam wolne miejsce"
  | "Robię nalot"
  | "Szukam lotu"
  | "Szukam współpasażera"
  | "Potrzebna pomoc na lotnisku"
  | "Szybowce"
  | "Skoki spadochronowe"
  | "Wydarzenie lotnicze"
  | "Wspólny wyjazd na lotnisko"
  | "Inne lotnicze";

export type CostType =
  | "brak kosztów"
  | "orientacyjny udział w kosztach"
  | "koszt do ustalenia"
  | "podział kosztów"
  | "zależny od trasy/czasu/pogody";

export type SettlementMethod =
  | "gotówka poza aplikacją"
  | "do ustalenia prywatnie"
  | "brak rozliczenia"
  | "inne poza aplikacją";

export type ListingStatus = "Aktualne" | "Zakończone" | "Anulowane";

export type ReservationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  location: string;
  bio?: string;
  aviationExperience?: string;
  favoriteAirports?: string[];
}

export interface Participant {
  userId: string;
  name: string;
  role: string;
  isAuthor?: boolean;
}

export interface Listing {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  category: Category;
  description: string;
  activityType: string;
  startLocation: string;
  startAirport?: string;
  destinationLocation?: string;
  destinationAirport?: string;
  date: string;
  time: string;
  totalSeats: number;
  availableSeats: number;
  costAmount?: number;
  costCurrency?: string;
  costType: CostType;
  settlementMethod: SettlementMethod;
  requirements?: string;
  organizationNotes?: string;
  participants: Participant[];
  participantsVisibility: "publiczna" | "tylko imię" | "ukryta";
  status: ListingStatus;
  imageUrl?: string;
}

export interface Reservation {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  seatsRequested: number;
  message: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId?: string;
  listingTitle?: string;
  participantIds: string[];
  participantNames: string[];
}

export interface Report {
  id: string;
  listingId: string;
  reporterId: string;
  reason: string;
  description?: string;
  status: "submitted" | "reviewed" | "rejected";
  createdAt: string;
}

export type Role = "user" | "admin";
export type Visibility = "public" | "verified";

export type Category =
  | "Budowa nalotu"
  | "Skoki spadochronowe"
  | "Holowanie szybowców"
  | "Event lotniskowy"
  | "Inne"
  // legacy categories - kept for backward compatibility on existing listings:
  | "Lot widokowy"
  | "Lot szkoleniowy"
  | "Lot turystyczny"
  | "Awionetka"
  | "Szybowiec"
  | "Paralotnia"
  | "Motoparalotnia"
  | "Helikopter";

export type ListingType = "offer" | "request";

export type ListingStatus =
  | "active"
  | "pending_review"
  | "rejected"
  | "closed";

export type CostType = "free" | "share" | "fuel" | "fixed";

export type SettlementMethod =
  | "Gotówka na miejscu"
  | "Przelew po locie"
  | "Do uzgodnienia"
  | "Bez kosztów";

export type ListingVisibility = "public" | "verified_only";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
  visibility: Visibility;
  banned: boolean;
  createdAt: string;
}

export interface Listing {
  id: string;
  authorId: string;
  authorName: string;
  type: ListingType;
  category: Category;
  title: string;
  description: string;
  activityType?: string | null;
  flightDate?: string | null;
  flightTime?: string | null;
  location: string;
  destination?: string | null;
  totalSeats?: number | null;
  availableSeats?: number | null;
  costType?: CostType | null;
  costAmount?: number | null;
  settlementMethod?: SettlementMethod | null;
  visibility: ListingVisibility;
  status: ListingStatus;
  moderationFlags?: string[] | null;
  moderationNote?: string | null;
  createdAt: string;
}

export type ReservationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface Reservation {
  id: string;
  listingId: string;
  listingTitle?: string;
  userId: string;
  userName: string;
  seats: number;
  message?: string | null;
  status: ReservationStatus;
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId?: string | null;
  listingTitle?: string | null;
  otherUserId: string;
  otherUserName: string;
  lastMessageAt: string;
  lastMessageBody?: string | null;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  body: string;
  createdAt: string;
}

export type ReportReason =
  | "Wprowadzające w błąd"
  | "Komercja / sprzedaż biletów"
  | "Niebezpieczne zachowania"
  | "Spam / reklama"
  | "Obraźliwa treść"
  | "Oszustwo"
  | "Inne";

export interface Report {
  id: string;
  listingId: string;
  listingTitle?: string;
  reporterId?: string | null;
  reporterName?: string | null;
  reason: ReportReason;
  details?: string | null;
  status: "open" | "resolved";
  createdAt: string;
}

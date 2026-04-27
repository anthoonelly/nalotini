"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  CURRENT_USER,
  MOCK_CONVERSATIONS,
  MOCK_LISTINGS,
  MOCK_MESSAGES,
  MOCK_RESERVATIONS,
} from "./mockData";
import {
  Conversation,
  Listing,
  Message,
  Report,
  Reservation,
  User,
} from "./types";

interface AppContextValue {
  currentUser: User;
  listings: Listing[];
  reservations: Reservation[];
  conversations: Conversation[];
  messages: Message[];
  reports: Report[];

  // Listings
  addListing: (listing: Omit<Listing, "id" | "authorId" | "authorName" | "authorRole" | "participants" | "status" | "availableSeats"> & {
    availableSeats?: number;
  }) => string;
  getListing: (id: string) => Listing | undefined;

  // Reservations
  requestReservation: (listingId: string, seats: number, message: string) => void;
  acceptReservation: (reservationId: string) => void;
  rejectReservation: (reservationId: string) => void;
  cancelReservation: (reservationId: string) => void;

  // Messages
  sendMessage: (conversationId: string, body: string) => void;
  startConversation: (listingId: string) => string;

  // Reports
  reportListing: (listingId: string, reason: string, description?: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser] = useState<User>(CURRENT_USER);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [reports, setReports] = useState<Report[]>([]);

  const getListing = useCallback(
    (id: string) => listings.find((l) => l.id === id),
    [listings]
  );

  const addListing: AppContextValue["addListing"] = useCallback((data) => {
    const id = uid("listing");
    const newListing: Listing = {
      id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      participants: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          role: `autor / ${currentUser.role}`,
          isAuthor: true,
        },
      ],
      status: "Aktualne",
      availableSeats: data.availableSeats ?? data.totalSeats,
      ...data,
    };
    setListings((prev) => [newListing, ...prev]);
    return id;
  }, [currentUser]);

  const requestReservation = useCallback(
    (listingId: string, seats: number, message: string) => {
      const reservation: Reservation = {
        id: uid("res"),
        listingId,
        userId: currentUser.id,
        userName: currentUser.name,
        seatsRequested: seats,
        message,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setReservations((prev) => [reservation, ...prev]);
    },
    [currentUser]
  );

  const acceptReservation = useCallback((reservationId: string) => {
    setReservations((prevRes) => {
      const reservation = prevRes.find((r) => r.id === reservationId);
      if (!reservation || reservation.status !== "pending") return prevRes;

      // Update listing
      setListings((prevList) =>
        prevList.map((listing) => {
          if (listing.id !== reservation.listingId) return listing;
          if (listing.availableSeats < reservation.seatsRequested) return listing;
          return {
            ...listing,
            availableSeats: listing.availableSeats - reservation.seatsRequested,
            participants: [
              ...listing.participants,
              {
                userId: reservation.userId,
                name: reservation.userName,
                role: "współuczestnik",
              },
            ],
          };
        })
      );

      return prevRes.map((r) =>
        r.id === reservationId ? { ...r, status: "accepted" as const } : r
      );
    });
  }, []);

  const rejectReservation = useCallback((reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, status: "rejected" as const } : r
      )
    );
  }, []);

  const cancelReservation = useCallback((reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, status: "cancelled" as const } : r
      )
    );
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      const msg: Message = {
        id: uid("msg"),
        conversationId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        body: trimmed,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, msg]);
    },
    [currentUser]
  );

  const startConversation = useCallback(
    (listingId: string) => {
      const listing = listings.find((l) => l.id === listingId);
      const existing = conversations.find(
        (c) =>
          c.listingId === listingId &&
          c.participantIds.includes(currentUser.id) &&
          (!listing || c.participantIds.includes(listing.authorId))
      );
      if (existing) return existing.id;

      const id = uid("conv");
      const conv: Conversation = {
        id,
        listingId,
        listingTitle: listing?.title,
        participantIds: [currentUser.id, listing?.authorId ?? "unknown"],
        participantNames: [currentUser.name, listing?.authorName ?? "Autor"],
      };
      setConversations((prev) => [conv, ...prev]);
      return id;
    },
    [conversations, listings, currentUser]
  );

  const reportListing = useCallback(
    (listingId: string, reason: string, description?: string) => {
      const report: Report = {
        id: uid("rep"),
        listingId,
        reporterId: currentUser.id,
        reason,
        description,
        status: "submitted",
        createdAt: new Date().toISOString(),
      };
      setReports((prev) => [...prev, report]);
    },
    [currentUser]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      currentUser,
      listings,
      reservations,
      conversations,
      messages,
      reports,
      addListing,
      getListing,
      requestReservation,
      acceptReservation,
      rejectReservation,
      cancelReservation,
      sendMessage,
      startConversation,
      reportListing,
    }),
    [
      currentUser,
      listings,
      reservations,
      conversations,
      messages,
      reports,
      addListing,
      getListing,
      requestReservation,
      acceptReservation,
      rejectReservation,
      cancelReservation,
      sendMessage,
      startConversation,
      reportListing,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

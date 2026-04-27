import { NextRequest, NextResponse } from "next/server";
import { createReservation, getListingById } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }

  const body = await req.json();
  const listingId = String(body.listingId || "");
  const seats = Math.max(1, Math.min(10, Number(body.seats) || 1));
  const message = body.message ? String(body.message).slice(0, 1000) : "";

  const listing = await getListingById(listingId);
  if (!listing) {
    return NextResponse.json({ error: "Nie znaleziono ogłoszenia" }, { status: 404 });
  }
  if (listing.authorId === user.id) {
    return NextResponse.json(
      { error: "Nie można zarezerwować własnego ogłoszenia" },
      { status: 400 }
    );
  }
  if (listing.status !== "active") {
    return NextResponse.json(
      { error: "Ogłoszenie nie jest aktywne" },
      { status: 400 }
    );
  }
  if (
    listing.availableSeats !== null &&
    listing.availableSeats !== undefined &&
    listing.availableSeats < seats
  ) {
    return NextResponse.json(
      { error: "Niewystarczająca liczba wolnych miejsc" },
      { status: 400 }
    );
  }

  const reservation = await createReservation({
    listingId,
    userId: user.id,
    seats,
    message,
    authorId: listing.authorId,
  });

  return NextResponse.json({ reservation });
}

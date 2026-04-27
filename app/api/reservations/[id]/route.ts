import { NextRequest, NextResponse } from "next/server";
import {
  getReservation,
  getListingById,
  updateReservationStatus,
  decrementListingSeats,
} from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }

  const reservation = await getReservation(params.id);
  if (!reservation) {
    return NextResponse.json({ error: "Nie znaleziono" }, { status: 404 });
  }

  const listing = await getListingById(reservation.listingId);
  if (!listing) {
    return NextResponse.json({ error: "Brak ogłoszenia" }, { status: 404 });
  }

  const body = await req.json();
  const action = String(body.action || "");

  // Cancel - allowed by reservation owner only
  if (action === "cancel") {
    if (reservation.userId !== user.id) {
      return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
    }
    await updateReservationStatus(params.id, "cancelled");
    return NextResponse.json({ ok: true });
  }

  // Accept / reject - allowed by listing author or admin
  if (action === "accept" || action === "reject") {
    if (listing.authorId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
    }
    if (reservation.status !== "pending") {
      return NextResponse.json(
        { error: "Rezerwacja już rozpatrzona" },
        { status: 400 }
      );
    }

    if (action === "accept") {
      if (
        listing.availableSeats !== null &&
        listing.availableSeats !== undefined &&
        listing.availableSeats < reservation.seats
      ) {
        return NextResponse.json(
          { error: "Brak wolnych miejsc" },
          { status: 400 }
        );
      }
      await updateReservationStatus(params.id, "accepted");
      await decrementListingSeats(reservation.listingId, reservation.seats);
    } else {
      await updateReservationStatus(params.id, "rejected");
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Nieprawidłowa akcja" }, { status: 400 });
}

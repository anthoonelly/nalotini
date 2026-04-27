import { NextRequest, NextResponse } from "next/server";
import { getListingById, deleteListing, adminUpdateListing } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const listing = await getListingById(params.id);
  if (!listing) {
    return NextResponse.json({ error: "Nie znaleziono" }, { status: 404 });
  }
  return NextResponse.json({ listing });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }

  const listing = await getListingById(params.id);
  if (!listing) {
    return NextResponse.json({ error: "Nie znaleziono" }, { status: 404 });
  }

  if (listing.authorId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const body = await req.json();
  await adminUpdateListing(params.id, body);
  const updated = await getListingById(params.id);
  return NextResponse.json({ listing: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }

  const listing = await getListingById(params.id);
  if (!listing) {
    return NextResponse.json({ error: "Nie znaleziono" }, { status: 404 });
  }

  if (listing.authorId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  await deleteListing(params.id);
  return NextResponse.json({ ok: true });
}

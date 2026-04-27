import { NextRequest, NextResponse } from "next/server";
import {
  updateListingStatus,
  adminUpdateListing,
  deleteListing,
  getListingById,
} from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const body = await req.json();
  const action = String(body.action || "");
  const note = body.note ? String(body.note).slice(0, 500) : undefined;

  const listing = await getListingById(params.id);
  if (!listing) {
    return NextResponse.json({ error: "Nie znaleziono" }, { status: 404 });
  }

  if (action === "approve") {
    await updateListingStatus(params.id, "active", note);
    return NextResponse.json({ ok: true });
  }
  if (action === "reject") {
    await updateListingStatus(params.id, "rejected", note);
    return NextResponse.json({ ok: true });
  }
  if (action === "close") {
    await updateListingStatus(params.id, "closed", note);
    return NextResponse.json({ ok: true });
  }
  if (action === "edit") {
    await adminUpdateListing(params.id, body.fields ?? {});
    return NextResponse.json({ ok: true });
  }
  if (action === "delete") {
    await deleteListing(params.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Nieznana akcja" }, { status: 400 });
}

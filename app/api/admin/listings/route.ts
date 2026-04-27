import { NextResponse } from "next/server";
import { getAllListingsForAdmin, getPendingListings } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const onlyPending = searchParams.get("status") === "pending_review";

  const listings = onlyPending
    ? await getPendingListings()
    : await getAllListingsForAdmin();
  return NextResponse.json({ listings });
}

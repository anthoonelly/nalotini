import { NextRequest, NextResponse } from "next/server";
import { getActiveListings, createListing } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listings = await getActiveListings({
    category: searchParams.get("category") || undefined,
    location: searchParams.get("location") || undefined,
    fromDate: searchParams.get("fromDate") || undefined,
    onlyAvailable: searchParams.get("onlyAvailable") === "1",
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  });
  return NextResponse.json({ listings });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const required = ["type", "category", "title", "description", "location"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Pole ${field} jest wymagane` },
          { status: 400 }
        );
      }
    }

    const listing = await createListing({
      authorId: user.id,
      type: body.type,
      category: body.category,
      title: String(body.title).slice(0, 200),
      description: String(body.description).slice(0, 5000),
      activityType: body.activityType || null,
      flightDate: body.flightDate || null,
      flightTime: body.flightTime || null,
      location: String(body.location).slice(0, 200),
      destination: body.destination || null,
      totalSeats: body.totalSeats ? Number(body.totalSeats) : null,
      availableSeats: body.availableSeats ? Number(body.availableSeats) : null,
      costType: body.costType || null,
      costAmount: body.costAmount ? Number(body.costAmount) : null,
      settlementMethod: body.settlementMethod || null,
      visibility: body.visibility || "public",
    });

    return NextResponse.json({ listing });
  } catch (err: any) {
    console.error("Create listing error:", err);
    return NextResponse.json(
      { error: err?.message || "Błąd serwera" },
      { status: 500 }
    );
  }
}

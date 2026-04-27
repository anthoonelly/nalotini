import { NextRequest, NextResponse } from "next/server";
import { createReport } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  const body = await req.json();
  const listingId = String(body.listingId || "");
  const reason = String(body.reason || "");
  const details = body.details ? String(body.details).slice(0, 1000) : null;

  if (!listingId || !reason) {
    return NextResponse.json(
      { error: "listingId i reason są wymagane" },
      { status: 400 }
    );
  }

  await createReport({
    listingId,
    reporterId: user?.id ?? null,
    reason,
    details,
  });
  return NextResponse.json({ ok: true });
}

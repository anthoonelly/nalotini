import { NextRequest, NextResponse } from "next/server";
import { resolveReport } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const note = body.note ? String(body.note).slice(0, 500) : undefined;
  await resolveReport(params.id, user.id, note);
  return NextResponse.json({ ok: true });
}

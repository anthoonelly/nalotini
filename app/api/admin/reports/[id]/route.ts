import { NextRequest, NextResponse } from "next/server";
import { resolveReport } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }
  await resolveReport(params.id);
  return NextResponse.json({ ok: true });
}

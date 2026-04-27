import { NextResponse } from "next/server";
import { getOpenReports, getResolvedReports } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "open";
  const reports = status === "resolved" ? await getResolvedReports() : await getOpenReports();
  return NextResponse.json({ reports });
}

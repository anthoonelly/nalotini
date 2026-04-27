import { NextResponse } from "next/server";
import { getOpenReports } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }
  const reports = await getOpenReports();
  return NextResponse.json({ reports });
}

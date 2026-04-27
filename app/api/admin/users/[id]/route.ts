import { NextRequest, NextResponse } from "next/server";
import { setUserBanned, setUserRole } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }
  if (params.id === user.id) {
    return NextResponse.json(
      { error: "Nie możesz modyfikować własnego konta" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const action = String(body.action || "");

  if (action === "ban") {
    await setUserBanned(params.id, true);
    return NextResponse.json({ ok: true });
  }
  if (action === "unban") {
    await setUserBanned(params.id, false);
    return NextResponse.json({ ok: true });
  }
  if (action === "promote") {
    await setUserRole(params.id, "admin");
    return NextResponse.json({ ok: true });
  }
  if (action === "demote") {
    await setUserRole(params.id, "user");
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Nieznana akcja" }, { status: 400 });
}

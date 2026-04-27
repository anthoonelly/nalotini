import { NextRequest, NextResponse } from "next/server";
import { updateUserProfile, getUserById } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }
  const profile = await getUserById(user.id);
  return NextResponse.json({ profile });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }
  const body = await req.json();
  await updateUserProfile(user.id, {
    name: body.name,
    phone: body.phone,
    visibility: body.visibility,
  });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Nieprawidłowy email" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Hasło musi mieć minimum 8 znaków" },
        { status: 400 }
      );
    }
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Wpisz imię i nazwisko" }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Konto z tym emailem już istnieje" },
        { status: 409 }
      );
    }

    await createUser({ email, password, name, phone });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: err?.message || "Błąd serwera" },
      { status: 500 }
    );
  }
}

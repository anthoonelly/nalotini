import { NextRequest, NextResponse } from "next/server";
import { getMessages, sendMessage, markConversationRead } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }
  const messages = await getMessages(params.id, user.id);
  // Oznacz konwersację jako przeczytaną
  await markConversationRead(params.id, user.id);
  return NextResponse.json({ messages });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }

  const body = await req.json();
  const text = String(body.body || "").trim();
  if (!text) {
    return NextResponse.json({ error: "Pusta wiadomość" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Wiadomość zbyt długa" }, { status: 400 });
  }

  await sendMessage({
    conversationId: params.id,
    senderId: user.id,
    body: text,
  });

  return NextResponse.json({ ok: true });
}

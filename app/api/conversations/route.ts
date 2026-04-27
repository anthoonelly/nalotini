import { NextRequest, NextResponse } from "next/server";
import { getOrCreateConversation, getUserConversations } from "@/lib/queries";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }
  const conversations = await getUserConversations(user.id);
  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }

  const body = await req.json();
  const otherUserId = String(body.otherUserId || "");
  const listingId = body.listingId ? String(body.listingId) : null;

  if (!otherUserId || otherUserId === user.id) {
    return NextResponse.json({ error: "Nieprawidłowy odbiorca" }, { status: 400 });
  }

  const id = await getOrCreateConversation({
    userId: user.id,
    otherUserId,
    listingId,
  });
  return NextResponse.json({ conversationId: id });
}

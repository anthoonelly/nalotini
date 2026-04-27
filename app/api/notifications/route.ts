import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getUnreadMessageCount, getPendingReservationsCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ unreadMessages: 0, pendingReservations: 0 });
  }
  try {
    const [unreadMessages, pendingReservations] = await Promise.all([
      getUnreadMessageCount(user.id),
      getPendingReservationsCount(user.id),
    ]);
    return NextResponse.json({ unreadMessages, pendingReservations });
  } catch {
    return NextResponse.json({ unreadMessages: 0, pendingReservations: 0 });
  }
}

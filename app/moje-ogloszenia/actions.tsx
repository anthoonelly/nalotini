"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  reservationId: string;
  otherUserId: string;
  listingId: string;
}

export default function MyListingsActions({ reservationId, otherUserId, listingId }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "accept" | "reject") {
    setBusy(true);
    const res = await fetch(`/api/reservations/${reservationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Nie udało się wykonać akcji");
    }
  }

  async function message() {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otherUserId, listingId }),
    });
    const data = await res.json();
    if (res.ok && data.conversationId) {
      router.push(`/wiadomosci?conv=${data.conversationId}`);
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={message} disabled={busy} className="btn btn-ghost text-xs">
        Napisz
      </button>
      <button
        onClick={() => act("reject")}
        disabled={busy}
        className="btn btn-secondary text-xs !text-rose-700"
      >
        Odrzuć
      </button>
      <button
        onClick={() => act("accept")}
        disabled={busy}
        className="btn btn-primary text-xs"
      >
        Akceptuj
      </button>
    </div>
  );
}

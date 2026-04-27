"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MyReservationsActions({ reservationId }: { reservationId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function cancel() {
    if (!confirm("Anulować prośbę o miejsce?")) return;
    setBusy(true);
    const res = await fetch(`/api/reservations/${reservationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      alert("Nie udało się anulować rezerwacji");
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <button
        onClick={cancel}
        disabled={busy}
        className="btn btn-ghost text-rose-700 text-sm"
      >
        {busy ? "Anuluję..." : "Anuluj prośbę"}
      </button>
    </div>
  );
}

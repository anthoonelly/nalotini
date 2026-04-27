"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Listing } from "@/lib/types";
import Modal from "./Modal";
import SafetyNote from "./SafetyNote";

interface Props {
  listing: Listing;
  open: boolean;
  onClose: () => void;
}

export default function ReservationModal({ listing, open, onClose }: Props) {
  const router = useRouter();
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxSeats = Math.max(1, listing.availableSeats ?? 1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          seats,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Wystąpił błąd");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      setSubmitting(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Błąd sieci");
      setSubmitting(false);
    }
  }

  function handleClose() {
    setSuccess(false);
    setSeats(1);
    setMessage("");
    setError(null);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Poproś o miejsce">
      {success ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <h3 className="font-semibold text-emerald-900">
              Wysłano prośbę! ✈️
            </h3>
            <p className="text-sm text-emerald-800 mt-1">
              Autor ogłoszenia otrzyma Twoją prośbę i odpowie w wiadomości.
              Możesz śledzić status w zakładce „Moje rezerwacje".
            </p>
          </div>
          <button onClick={handleClose} className="btn btn-primary w-full">
            Rozumiem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Ile miejsc rezerwujesz?</label>
            <input
              type="number"
              min={1}
              max={maxSeats}
              value={seats}
              onChange={(e) => setSeats(Math.max(1, Math.min(maxSeats, Number(e.target.value))))}
              className="input"
            />
            <p className="text-xs text-slate-500 mt-1">
              Maksymalnie: {maxSeats}
            </p>
          </div>

          <div>
            <label className="label">Wiadomość do autora (opcjonalnie)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Cześć! Chętnie polecę z Tobą. Czy są jakieś szczegóły, o których powinienem/powinnam wiedzieć?"
              className="input"
              maxLength={1000}
            />
          </div>

          <SafetyNote variant="info">
            To <b>nie jest</b> zakup biletu — to prośba o miejsce. Autor musi
            potwierdzić rezerwację. Wszelkie rozliczenia odbywają się poza
            aplikacją.
          </SafetyNote>

          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost flex-1"
              disabled={submitting}
            >
              Anuluj
            </button>
            <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
              {submitting ? "Wysyłam..." : "Wyślij prośbę"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

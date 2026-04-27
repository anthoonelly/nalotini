"use client";

import { useState } from "react";
import Modal from "./Modal";
import SafetyNote from "./SafetyNote";
import { Listing } from "@/lib/types";
import { useApp } from "@/lib/store";

interface Props {
  open: boolean;
  onClose: () => void;
  listing: Listing;
}

export default function ReservationModal({ open, onClose, listing }: Props) {
  const { requestReservation } = useApp();
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const max = Math.max(1, listing.availableSeats);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    requestReservation(listing.id, seats, message);
    setSubmitted(true);
  }

  function reset() {
    setSeats(1);
    setMessage("");
    setSubmitted(false);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={reset}
      title={submitted ? "Prośba wysłana" : "Poproś o miejsce"}
    >
      {submitted ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 text-xl mx-auto">
            ✓
          </div>
          <p className="text-sm text-slate-700 text-center">
            Twoja prośba czeka na akceptację autora ogłoszenia. Status sprawdzisz
            w sekcji „Moje rezerwacje”.
          </p>
          <SafetyNote variant="info">
            Rezerwacja oznacza zgłoszenie chęci udziału. Nie jest płatnością ani
            gwarancją wykonania lotu.
          </SafetyNote>
          <button onClick={reset} className="btn-primary w-full">
            Zamknij
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-xs text-slate-500">Ogłoszenie</p>
            <p className="font-semibold text-brand-900">{listing.title}</p>
          </div>

          <div>
            <label className="label">Liczba miejsc</label>
            <input
              type="number"
              min={1}
              max={max}
              value={seats}
              onChange={(e) => setSeats(Math.min(max, Math.max(1, Number(e.target.value))))}
              className="input"
            />
            <p className="text-xs text-slate-500 mt-1">
              Dostępne wolne miejsca: {listing.availableSeats}
            </p>
          </div>

          <div>
            <label className="label">Wiadomość do autora (opcjonalnie)</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cześć! Chętnie dołączę. Mam doświadczenie / pierwszy raz / jestem dyspozycyjny od..."
              className="input resize-none"
            />
          </div>

          <SafetyNote variant="info">
            Nalotini nie obsługuje płatności online. Rozliczenie odbywa się
            bezpośrednio z autorem poza aplikacją. Rezerwacja nie jest
            gwarancją wykonania lotu.
          </SafetyNote>

          <div className="flex gap-2">
            <button type="button" onClick={reset} className="btn-secondary flex-1">
              Anuluj
            </button>
            <button type="submit" className="btn-primary flex-1">
              Wyślij prośbę
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

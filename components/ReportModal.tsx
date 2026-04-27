"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useApp } from "@/lib/store";

const REASONS = [
  "wygląda jak sprzedaż biletu",
  "wygląda jak komercyjny przewóz",
  "fałszywe informacje",
  "spam",
  "niebezpieczna treść",
  "obraźliwe treści",
  "inne",
];

interface Props {
  open: boolean;
  onClose: () => void;
  listingId: string;
}

export default function ReportModal({ open, onClose, listingId }: Props) {
  const { reportListing } = useApp();
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reportListing(listingId, reason, description);
    setSubmitted(true);
  }

  function reset() {
    setReason(REASONS[0]);
    setDescription("");
    setSubmitted(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={reset} title={submitted ? "Dziękujemy" : "Zgłoś ogłoszenie"}>
      {submitted ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 text-xl mx-auto">
            ✓
          </div>
          <p className="text-sm text-slate-700 text-center">
            Dziękujemy. Zgłoszenie zostało zapisane do weryfikacji.
          </p>
          <button onClick={reset} className="btn-primary w-full">
            Zamknij
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Powód zgłoszenia</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Dodatkowy opis (opcjonalnie)</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={reset} className="btn-secondary flex-1">
              Anuluj
            </button>
            <button type="submit" className="btn-primary flex-1">
              Wyślij zgłoszenie
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

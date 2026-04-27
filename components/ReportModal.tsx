"use client";

import { useState } from "react";
import Modal from "./Modal";

interface Props {
  listingId: string;
  open: boolean;
  onClose: () => void;
}

const REASONS = [
  "Wprowadzające w błąd",
  "Komercja / sprzedaż biletów",
  "Niebezpieczne zachowania",
  "Spam / reklama",
  "Obraźliwa treść",
  "Oszustwo",
  "Inne",
];

export default function ReportModal({ listingId, open, onClose }: Props) {
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, reason, details }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Wystąpił błąd");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      setSubmitting(false);
    } catch (err: any) {
      setError(err?.message || "Błąd sieci");
      setSubmitting(false);
    }
  }

  function handleClose() {
    setSuccess(false);
    setReason(REASONS[0]);
    setDetails("");
    setError(null);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Zgłoś ogłoszenie">
      {success ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <h3 className="font-semibold text-emerald-900">Dziękujemy</h3>
            <p className="text-sm text-emerald-800 mt-1">
              Zgłoszenie trafiło do moderatora. Sprawdzimy je możliwie szybko.
            </p>
          </div>
          <button onClick={handleClose} className="btn btn-primary w-full">
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
            <label className="label">Szczegóły (opcjonalnie)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Opisz, co budzi Twoje wątpliwości"
              className="input"
              maxLength={1000}
            />
          </div>

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
              {submitting ? "Wysyłam..." : "Wyślij zgłoszenie"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

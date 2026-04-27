"use client";

import { useMemo } from "react";

interface Props {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  minDate?: string;
}

export default function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  minDate,
}: Props) {
  const [hh = "", mm = ""] = (time || "").split(":");

  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")),
    []
  );
  const minutes = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")),
    []
  );

  function handleHour(h: string) {
    const newTime = `${h}:${mm || "00"}`;
    onTimeChange(newTime);
  }
  function handleMinute(m: string) {
    const newTime = `${hh || "12"}:${m}`;
    onTimeChange(newTime);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50/50 to-white p-4 space-y-3">
      {/* Data */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-brand-900 mb-1.5">
          <span aria-hidden>📅</span>
          Data lotu
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          min={minDate}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* Godzina (godziny + minuty co 5) */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-brand-900 mb-1.5">
          <span aria-hidden>🕐</span>
          Godzina <span className="font-normal text-slate-500">(opcjonalnie)</span>
        </label>
        <div className="flex items-center gap-2">
          <select
            value={hh}
            onChange={(e) => handleHour(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            aria-label="Godzina"
          >
            <option value="">--</option>
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          <span className="text-2xl font-bold text-slate-300">:</span>

          <select
            value={mm}
            onChange={(e) => handleMinute(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            aria-label="Minuty"
          >
            <option value="">--</option>
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {time && (
            <button
              type="button"
              onClick={() => onTimeChange("")}
              className="text-xs text-slate-500 hover:text-rose-700 px-2"
              aria-label="Wyczyść godzinę"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

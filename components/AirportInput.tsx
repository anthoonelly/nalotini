"use client";

import { useId, useMemo } from "react";
import { POLISH_AIRFIELDS } from "@/lib/airports";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  name?: string;
  label?: string;
}

export default function AirportInput({
  value,
  onChange,
  placeholder = "np. Aeroklub Warszawski - Babice",
  required,
  id,
  name,
  label,
}: Props) {
  const autoId = useId();
  const inputId = id ?? `airport-${autoId}`;
  const listId = `airports-${autoId}`;

  const suggestions = useMemo(() => POLISH_AIRFIELDS, []);

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type="text"
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="input"
        autoComplete="off"
      />
      <datalist id={listId}>
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
}

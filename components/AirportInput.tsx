"use client";

import { POLISH_AIRFIELDS } from "@/lib/airports";
import AutocompleteInput from "./AutocompleteInput";

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
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <AutocompleteInput
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        options={POLISH_AIRFIELDS}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

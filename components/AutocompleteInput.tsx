"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  id?: string;
  name?: string;
  minChars?: number;
  maxResults?: number;
  className?: string;
}

export default function AutocompleteInput({
  value,
  onChange,
  options,
  placeholder,
  required,
  id,
  name,
  minChars = 2,
  maxResults = 8,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const q = value.trim().toLowerCase();
  const showDropdown = open && q.length >= minChars;

  const filtered = showDropdown
    ? options
        .filter((o) => o.toLowerCase().includes(q))
        .slice(0, maxResults)
    : [];

  // Close on click outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? filtered.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      onChange(filtered[activeIdx]);
      setOpen(false);
      setActiveIdx(-1);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className={`relative ${className ?? ""}`}>
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActiveIdx(-1);
        }}
        onFocus={() => {
          // Otwórz tylko jeśli jest już tekst
          if (value.trim().length >= minChars) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        className="input"
        autoComplete="off"
      />

      {showDropdown && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {filtered.map((opt, i) => (
            <li key={opt}>
              <button
                type="button"
                onMouseDown={(e) => {
                  // mousedown żeby zadziałać przed onBlur na input
                  e.preventDefault();
                  onChange(opt);
                  setOpen(false);
                  setActiveIdx(-1);
                }}
                className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${
                  i === activeIdx
                    ? "bg-brand-50 text-brand-900"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

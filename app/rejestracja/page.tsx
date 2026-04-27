"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import SafetyNote from "@/components/SafetyNote";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Błąd rejestracji");
        setSubmitting(false);
        return;
      }

      // Auto-login
      const loginRes = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (loginRes?.error) {
        // Konto utworzone, ale auto-login nie zadziałał
        router.push("/logowanie");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Błąd sieci");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-brand-900">Załóż konto</h1>
        <p className="text-sm text-slate-600 mt-1">
          Bezpłatnie. Zajmie Ci to mniej niż minutę.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="label" htmlFor="name">Imię i nazwisko</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
            minLength={2}
            placeholder="Jan Kowalski"
          />
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
            autoComplete="email"
            placeholder="ty@email.pl"
          />
        </div>

        <div>
          <label className="label" htmlFor="phone">
            Telefon <span className="text-slate-400 font-normal">(opcjonalnie)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
            placeholder="+48..."
          />
        </div>

        <div>
          <label className="label" htmlFor="password">Hasło</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <p className="text-xs text-slate-500 mt-1">Minimum 8 znaków</p>
        </div>

        <SafetyNote variant="info">
          Tworząc konto, akceptujesz, że Nalotini jest platformą niekomercyjną.
          Nie sprzedajesz biletów ani usług komercyjnych — dzielisz się
          miejscem w locie i kosztami.
        </SafetyNote>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? "Tworzę konto..." : "Załóż konto"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Masz już konto?{" "}
        <Link href="/logowanie" className="text-brand-700 font-medium hover:underline">
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}

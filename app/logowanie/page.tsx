"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Nieprawidłowy email lub hasło");
      setSubmitting(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-brand-900">Zaloguj się</h1>
        <p className="text-sm text-slate-600 mt-1">
          Witaj z powrotem w Nalotini ✈️
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
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
          <label className="label" htmlFor="password">Hasło</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Nie masz konta?{" "}
        <Link href="/rejestracja" className="text-brand-700 font-medium hover:underline">
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-500">Ładowanie...</div>}>
      <LoginContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Avatar from "@/components/Avatar";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [visibility, setVisibility] = useState("verified");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
          setName(data.profile.name || "");
          setPhone(data.profile.phone || "");
          setVisibility(data.profile.visibility || "verified");
        }
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, visibility }),
    });
    setSaving(false);
    if (res.ok) {
      setSaveMessage("Zapisano ✓");
      router.refresh();
    } else {
      setSaveMessage("Błąd zapisu");
    }
  }

  if (!profile) {
    return <div className="text-center py-12 text-slate-500">Ładowanie...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <header className="flex items-center gap-4">
        <Avatar name={profile.name} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-brand-900">{profile.name}</h1>
          <p className="text-sm text-slate-600">{profile.email}</p>
          {profile.role === "admin" && (
            <span className="chip-amber mt-1 inline-block">Administrator</span>
          )}
        </div>
      </header>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Link href="/moje-ogloszenia" className="card p-3 text-center hover:shadow-soft transition">
          <p className="text-2xl">✈️</p>
          <p className="text-xs font-medium text-slate-700 mt-1">Moje ogłoszenia</p>
        </Link>
        <Link href="/moje-rezerwacje" className="card p-3 text-center hover:shadow-soft transition">
          <p className="text-2xl">📋</p>
          <p className="text-xs font-medium text-slate-700 mt-1">Rezerwacje</p>
        </Link>
        <Link href="/wiadomosci" className="card p-3 text-center hover:shadow-soft transition">
          <p className="text-2xl">💬</p>
          <p className="text-xs font-medium text-slate-700 mt-1">Wiadomości</p>
        </Link>
        <Link href="/bezpieczenstwo" className="card p-3 text-center hover:shadow-soft transition">
          <p className="text-2xl">🛡️</p>
          <p className="text-xs font-medium text-slate-700 mt-1">Bezpieczeństwo</p>
        </Link>
      </div>

      {profile.role === "admin" && (
        <Link href="/admin" className="card p-4 bg-amber-50 border-amber-200 flex items-center justify-between hover:shadow-soft transition">
          <div>
            <p className="font-semibold text-amber-900">Panel administratora</p>
            <p className="text-xs text-amber-700">Moderacja, użytkownicy, zgłoszenia</p>
          </div>
          <span className="text-amber-700">→</span>
        </Link>
      )}

      {/* Settings form */}
      <form onSubmit={save} className="card p-6 space-y-4">
        <h2 className="font-semibold text-brand-900">Ustawienia konta</h2>

        <div>
          <label className="label">Imię i nazwisko</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">Telefon (opcjonalnie)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
            placeholder="+48..."
          />
        </div>

        <div>
          <label className="label">Widoczność profilu</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="input"
          >
            <option value="verified">Tylko dla osób z kontem</option>
            <option value="public">Publicznie widoczny</option>
          </select>
        </div>

        {saveMessage && (
          <p className={`text-sm ${saveMessage.startsWith("Zapisano") ? "text-emerald-700" : "text-rose-700"}`}>
            {saveMessage}
          </p>
        )}

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Zapisuję..." : "Zapisz zmiany"}
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn btn-ghost text-slate-600"
          >
            Wyloguj
          </button>
        </div>
      </form>
    </div>
  );
}

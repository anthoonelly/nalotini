"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";

interface UserRow {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  banned: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id: string, action: "ban" | "unban" | "promote" | "demote") {
    if (action === "promote" && !confirm("Przyznać uprawnienia administratora?")) return;
    if (action === "demote" && !confirm("Odebrać uprawnienia administratora?")) return;
    if (action === "ban" && !confirm("Zbanować użytkownika?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusyId(null);
    if (res.ok) load();
    else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Nie udało się wykonać akcji");
    }
  }

  const filtered = users.filter(
    (u) =>
      !filter ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      u.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-brand-900">
          Użytkownicy ({users.length})
        </h1>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Szukaj po nazwie lub email..."
          className="input max-w-xs"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Ładowanie...</div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((u) => (
            <li key={u.id} className="card p-4 flex items-center gap-4 flex-wrap">
              <Avatar name={u.name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-slate-900">{u.name}</p>
                  {u.role === "admin" && <span className="chip-amber">Admin</span>}
                  {u.banned && <span className="chip-rose">Zbanowany</span>}
                </div>
                <p className="text-xs text-slate-500">{u.email}</p>
                <p className="text-xs text-slate-400">
                  Dołączył: {new Date(u.createdAt).toLocaleDateString("pl-PL")}
                </p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {u.banned ? (
                  <button
                    onClick={() => act(u.id, "unban")}
                    disabled={busyId === u.id}
                    className="btn btn-secondary text-xs"
                  >
                    Odbanuj
                  </button>
                ) : (
                  <button
                    onClick={() => act(u.id, "ban")}
                    disabled={busyId === u.id}
                    className="btn btn-ghost text-xs text-rose-700"
                  >
                    Zbanuj
                  </button>
                )}
                {u.role === "user" ? (
                  <button
                    onClick={() => act(u.id, "promote")}
                    disabled={busyId === u.id}
                    className="btn btn-ghost text-xs text-amber-700"
                  >
                    Promuj na admina
                  </button>
                ) : (
                  <button
                    onClick={() => act(u.id, "demote")}
                    disabled={busyId === u.id}
                    className="btn btn-ghost text-xs"
                  >
                    Odbierz admina
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

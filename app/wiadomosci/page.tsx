"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import Avatar from "@/components/Avatar";

function MessagesContent() {
  const { conversations, messages, currentUser, sendMessage } = useApp();
  const searchParams = useSearchParams();

  const [activeId, setActiveId] = useState<string | null>(
    conversations[0]?.id ?? null
  );
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const conv = searchParams.get("conv");
    if (conv) setActiveId(conv);
  }, [searchParams]);

  const active = conversations.find((c) => c.id === activeId);
  const activeMessages = messages
    .filter((m) => m.conversationId === activeId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  function otherName(c: typeof conversations[number]) {
    return (
      c.participantNames.find((n) => n !== currentUser.name) ?? "Rozmówca"
    );
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId) return;
    sendMessage(activeId, draft);
    setDraft("");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Wiadomości</h1>
        <p className="text-sm text-slate-600 mt-1">
          Rozmowy powiązane z ogłoszeniami.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-sm">Nie masz jeszcze żadnych rozmów.</p>
          <Link href="/ogloszenia" className="btn-primary mt-4 inline-flex">
            Przeglądaj ogłoszenia
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          {/* Lista rozmów */}
          <div className="card p-2">
            <ul className="divide-y divide-slate-100">
              {conversations.map((c) => {
                const last = messages
                  .filter((m) => m.conversationId === c.id)
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
                const isActive = c.id === activeId;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setActiveId(c.id)}
                      className={`w-full text-left p-3 rounded-xl flex gap-3 items-start transition-colors ${
                        isActive ? "bg-brand-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <Avatar name={otherName(c)} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-900 truncate">
                          {otherName(c)}
                        </p>
                        {c.listingTitle && (
                          <p className="text-xs text-slate-500 truncate">
                            {c.listingTitle}
                          </p>
                        )}
                        {last && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {last.body}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Aktywna rozmowa */}
          <div className="card p-4 sm:p-5 flex flex-col min-h-[420px]">
            {active ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <Avatar name={otherName(active)} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-brand-900 truncate">
                      {otherName(active)}
                    </p>
                    {active.listingId && active.listingTitle && (
                      <Link
                        href={`/ogloszenia/${active.listingId}`}
                        className="text-xs text-brand-700 hover:underline truncate block"
                      >
                        {active.listingTitle}
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {activeMessages.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">
                      Nie ma jeszcze wiadomości. Napisz pierwszy.
                    </p>
                  )}
                  {activeMessages.map((m) => {
                    const isMe = m.senderId === currentUser.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                            isMe
                              ? "bg-brand-700 text-white rounded-br-md"
                              : "bg-slate-100 text-brand-900 rounded-bl-md"
                          }`}
                        >
                          {m.body}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-slate-100">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Napisz wiadomość..."
                    className="input"
                  />
                  <button type="submit" className="btn-primary" disabled={!draft.trim()}>
                    Wyślij
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
                Wybierz rozmowę z listy.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="card p-8 text-center text-slate-500 text-sm">Ładuję wiadomości…</div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}

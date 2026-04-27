"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Avatar from "@/components/Avatar";
import { Conversation, Message } from "@/lib/types";

function MessagesContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  async function loadConversations() {
    const res = await fetch("/api/conversations");
    if (res.ok) {
      const data = await res.json();
      setConversations(data.conversations || []);
      const fromUrl = searchParams.get("conv");
      if (fromUrl) {
        setActiveId(fromUrl);
      } else if (!activeId && data.conversations?.[0]) {
        setActiveId(data.conversations[0].id);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line
  }, []);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    async function load() {
      const res = await fetch(`/api/conversations/${activeId}/messages`);
      if (res.ok && !cancelled) {
        const data = await res.json();
        setMessages(data.messages || []);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;
    setSending(true);
    const res = await fetch(`/api/conversations/${activeId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft.trim() }),
    });
    if (res.ok) {
      setDraft("");
      // Reload messages
      const r2 = await fetch(`/api/conversations/${activeId}/messages`);
      if (r2.ok) {
        const data = await r2.json();
        setMessages(data.messages || []);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
      loadConversations();
    }
    setSending(false);
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Ładowanie wiadomości...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="card p-8 text-center text-slate-600">
        <p className="text-3xl mb-2">💬</p>
        <p className="font-medium">Brak wiadomości</p>
        <p className="text-sm mt-1">
          Rozpocznij rozmowę z autorem ogłoszenia, klikając „Napisz wiadomość" w ogłoszeniu.
        </p>
        <Link href="/ogloszenia" className="btn btn-primary mt-4 inline-block">
          Przeglądaj ogłoszenia
        </Link>
      </div>
    );
  }

  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-brand-900">Wiadomości</h1>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4 min-h-[60vh]">
        {/* Conversation list */}
        <aside className="card p-2 max-h-[70vh] overflow-y-auto">
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left p-3 rounded-lg flex gap-3 items-center transition ${
                    activeId === c.id ? "bg-brand-50" : "hover:bg-slate-50"
                  }`}
                >
                  <Avatar name={c.otherUserName} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {c.otherUserName}
                    </p>
                    {c.listingTitle && (
                      <p className="text-xs text-brand-700 truncate">{c.listingTitle}</p>
                    )}
                    {c.lastMessageBody && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {c.lastMessageBody}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat panel */}
        <section className="card flex flex-col max-h-[70vh]">
          {active ? (
            <>
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <Avatar name={active.otherUserName} size="sm" />
                <div className="min-w-0">
                  <p className="font-medium text-sm text-slate-900">{active.otherUserName}</p>
                  {active.listingTitle && (
                    <Link
                      href={`/ogloszenia/${active.listingId}`}
                      className="text-xs text-brand-700 hover:underline truncate block"
                    >
                      {active.listingTitle}
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-sm text-slate-500 py-8">
                    Brak wiadomości. Napisz pierwszą!
                  </p>
                ) : (
                  messages.map((m) => {
                    const mine = m.senderId === (session?.user as any)?.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                            mine
                              ? "bg-brand-700 text-white"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.body}</p>
                          <p className={`text-[10px] mt-0.5 ${mine ? "text-brand-100" : "text-slate-500"}`}>
                            {new Date(m.createdAt).toLocaleTimeString("pl-PL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Napisz wiadomość..."
                  className="input flex-1"
                  maxLength={2000}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending || !draft.trim()}
                >
                  Wyślij
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Wybierz rozmowę
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-500">Ładowanie...</div>}>
      <MessagesContent />
    </Suspense>
  );
}

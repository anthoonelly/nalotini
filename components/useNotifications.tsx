"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export interface NotificationCounts {
  unreadMessages: number;
  pendingReservations: number;
}

const POLL_INTERVAL_MS = 10000; // 10s

export function useNotifications(): NotificationCounts {
  const { data: session } = useSession();
  const [counts, setCounts] = useState<NotificationCounts>({
    unreadMessages: 0,
    pendingReservations: 0,
  });

  useEffect(() => {
    if (!session) {
      setCounts({ unreadMessages: 0, pendingReservations: 0 });
      return;
    }

    let cancelled = false;
    async function fetchCounts() {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setCounts(data);
        }
      } catch {
        /* ignoruj */
      }
    }

    fetchCounts();
    const interval = setInterval(fetchCounts, POLL_INTERVAL_MS);

    // Odśwież także gdy karta wraca do focusu
    function onVisibility() {
      if (document.visibilityState === "visible") fetchCounts();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [session]);

  return counts;
}

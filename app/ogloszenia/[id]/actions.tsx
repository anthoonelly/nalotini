"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Listing } from "@/lib/types";
import ReservationModal from "@/components/ReservationModal";
import ReportModal from "@/components/ReportModal";

interface Props {
  listing: Listing;
  isAuthor: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  noSeats: boolean;
}

export default function ListingDetailActions({
  listing,
  isAuthor,
  isLoggedIn,
  isAdmin,
  noSeats,
}: Props) {
  const router = useRouter();
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#poprosic" && isLoggedIn && !isAuthor && !noSeats) {
      setReserveOpen(true);
    }
  }, [isLoggedIn, isAuthor, noSeats]);

  async function startConversation() {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        otherUserId: listing.authorId,
        listingId: listing.id,
      }),
    });
    const data = await res.json();
    if (res.ok && data.conversationId) {
      router.push(`/wiadomosci?conv=${data.conversationId}`);
    }
  }

  async function handleDelete() {
    if (!confirm("Czy na pewno usunąć to ogłoszenie? Operacja jest nieodwracalna.")) return;
    const res = await fetch(`/api/listings/${listing.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/moje-ogloszenia");
      router.refresh();
    } else {
      alert("Nie udało się usunąć ogłoszenia.");
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 pt-2">
        {!isLoggedIn ? (
          <Link href={`/logowanie?callbackUrl=/ogloszenia/${listing.id}`} className="btn btn-primary">
            Zaloguj się, aby poprosić o miejsce
          </Link>
        ) : isAuthor ? (
          <>
            <Link href="/moje-ogloszenia" className="btn btn-primary">
              Zarządzaj ogłoszeniem
            </Link>
            <button onClick={handleDelete} className="btn btn-ghost text-rose-700">
              Usuń ogłoszenie
            </button>
          </>
        ) : (
          <>
            {!noSeats && listing.type === "offer" && listing.status === "active" && (
              <button onClick={() => setReserveOpen(true)} className="btn btn-primary">
                Poproś o miejsce
              </button>
            )}
            <button onClick={startConversation} className="btn btn-secondary">
              Napisz wiadomość
            </button>
            <button onClick={() => setReportOpen(true)} className="btn btn-ghost text-slate-600">
              Zgłoś
            </button>
          </>
        )}
        {isAdmin && !isAuthor && (
          <Link href="/admin/ogloszenia" className="btn btn-ghost text-amber-700">
            Panel moderatora →
          </Link>
        )}
      </div>

      {isLoggedIn && (
        <>
          <ReservationModal
            listing={listing}
            open={reserveOpen}
            onClose={() => setReserveOpen(false)}
          />
          <ReportModal
            listingId={listing.id}
            open={reportOpen}
            onClose={() => setReportOpen(false)}
          />
        </>
      )}
    </>
  );
}

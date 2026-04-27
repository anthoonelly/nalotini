import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Nalotini — społeczność lotnicza",
  description:
    "Znajdź lot, dołącz do załogi albo pomóż na lotnisku. Nalotini to tablica ogłoszeń społeczności lotniczej.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2a5b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen pb-24 lg:pb-0">
        <AppProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}

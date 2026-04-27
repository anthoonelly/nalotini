import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Nalotini — wspólne loty rekreacyjne",
  description:
    "Społecznościowa tablica ogłoszeń lotnictwa rekreacyjnego. Wspólne loty, podział kosztów, brak prowizji.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "any" },
      { url: "/icon.png?v=3", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png?v=3", type: "image/png" },
    shortcut: "/favicon.ico?v=3",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-gradient-to-b from-brand-50/40 via-white to-white text-slate-800 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-6 pb-28 lg:pb-12">{children}</main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}

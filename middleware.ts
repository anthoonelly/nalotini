import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const protectedPrefixes = [
          "/admin",
          "/dodaj",
          "/moje-rezerwacje",
          "/moje-ogloszenia",
          "/wiadomosci",
          "/profil",
        ];
        if (protectedPrefixes.some((p) => path.startsWith(p))) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dodaj/:path*",
    "/moje-rezerwacje/:path*",
    "/moje-ogloszenia/:path*",
    "/wiadomosci/:path*",
    "/profil/:path*",
  ],
};

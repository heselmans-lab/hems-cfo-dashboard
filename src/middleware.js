import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const path = req.nextUrl.pathname;

    // Check if authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Role-based path checks if necessary
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token && token.role !== "unauthorized",
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Protect everything except NextAuth routes, signin/error, static assets
     */
    "/((?!api/auth|auth|_next/static|_next/image|favicon.ico|icon.png|manifest.json).*)",
  ],
};

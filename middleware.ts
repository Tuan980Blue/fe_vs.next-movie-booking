import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Guarded routes: add more patterns as needed
const PROTECTED_MATCHERS = [
  "/admin",
  "/admin/:path*",
  "/user/:path*",
  "/profile",
  "/booking/:path*",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow auth pages
  if (pathname.startsWith("/auth")) return NextResponse.next();

  // Check whether path is protected
  const isProtected = PROTECTED_MATCHERS.some((pattern) => {
    if (pattern.endsWith(":path*")) {
      const base = pattern.replace(":path*", "");
      return pathname.startsWith(base);
    }
    return pathname === pattern;
  });

  if (!isProtected) return NextResponse.next();

  // Middleware cannot read sessionStorage/localStorage, only cookies/headers.
  // We use simple readable cookies `auth=1` and `role=<name>` set on client after login.
  const hasAuthCookie = req.cookies.get("auth")?.value === "1";

  if (!hasAuthCookie) {
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Enforce admin role for /admin routes
  if (pathname.startsWith("/admin")) {
    const role = (req.cookies.get("role")?.value || "").toLowerCase();
    const isAdmin = role === "admin";
    if (!isAdmin) {
      const deniedUrl = new URL("/403", req.url);
      return NextResponse.redirect(deniedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/profile",
    "/booking/:path*",
  ],
};



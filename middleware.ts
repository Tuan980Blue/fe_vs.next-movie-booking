import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Guarded routes: add more patterns as needed
const PROTECTED_MATCHERS = [
  "/admin",
  "/user",
  "/profile", 
  "/booking",
];

const ADMIN_ONLY_MATCHERS = [
  "/admin",
];

// Helper function to decode JWT payload (client-side only, no verification)
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const json = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

// Helper function to check if token is expired
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  
  const exp = typeof payload.exp === 'number' ? payload.exp : parseInt(payload.exp as string);
  return Date.now() >= exp * 1000;
}

// Helper function to extract roles from JWT token
function getRolesFromToken(token: string): string[] {
  const payload = decodeJwtPayload(token);
  if (!payload) return [];
  
  // Debug: Log the entire payload to see what claims are available
  console.log('JWT Payload in middleware:', payload);
  
  const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string ||
               payload.role as string ||
               payload.roles as string[];
  
  console.log('Role claim found in middleware:', roles);
  
  const result = Array.isArray(roles) ? roles : roles ? [roles] : [];
  console.log('Final roles in middleware:', result);
  
  return result;
}

// Helper function to check if user is admin
function isAdminFromToken(token: string): boolean {
  const roles = getRolesFromToken(token);
  return roles.some(role => role.toLowerCase() === 'admin');
}

// Helper function to check if path matches protected patterns
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_MATCHERS.some(pattern => pathname.startsWith(pattern));
}

// Helper function to check if path requires admin role
function requiresAdminRole(pathname: string): boolean {
  return ADMIN_ONLY_MATCHERS.some(pattern => pathname.startsWith(pattern));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow auth pages, public assets, and API routes
  if (pathname.startsWith("/auth") || 
      pathname.startsWith("/_next") || 
      pathname.startsWith("/api") ||
      pathname.startsWith("/favicon") ||
      pathname.startsWith("/public") ||
      pathname === "/") {
    return NextResponse.next();
  }

  // Check if path is protected
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // Get auth cookies
  const authCookie = req.cookies.get("auth")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const accessToken = req.cookies.get("access_token")?.value;

  // Check authentication status
  const hasAuthCookie = authCookie === "1";
  const hasValidRefreshToken = !!refreshToken;
  
  // Check if access token exists and is not expired
  let hasValidAccessToken = false;
  if (accessToken) {
    hasValidAccessToken = !isTokenExpired(accessToken);
  }

  // If not authenticated, redirect to login
  if (!hasAuthCookie || !hasValidRefreshToken) {
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, check admin role
  if (requiresAdminRole(pathname)) {
    const roleCookie = req.cookies.get("role")?.value;
    let isAdmin = roleCookie === "admin";
    
    // If no role cookie, try to extract from access token
    if (!roleCookie && accessToken && hasValidAccessToken) {
      isAdmin = isAdminFromToken(accessToken);
    }
    
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
    "/profile/:path*",
    "/booking/:path*",
  ],
};



/**
 * JWT utility functions for token parsing and validation
 */

export interface JwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  exp?: number; // seconds since epoch
  iat?: number;
  nbf?: number;
  jti?: string;
  // Role claims can come as either "role" or the Role URI claim type
  role?: string | string[];
  [key: string]: unknown;
}

/**
 * Decode JWT payload without verification (client-side only)
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    const json = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function getJwtExpiryUnix(token: string): number | null {
  const payload = decodeJwtPayload(token);
  return payload?.exp ?? null;
}

export function isJwtExpired(token: string, clockSkewSeconds = 30): boolean {
  const exp = getJwtExpiryUnix(token);
  if (!exp) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds >= (exp - clockSkewSeconds);
}

export function getJwtRoles(token: string): string[] {
  const payload = decodeJwtPayload(token);
  if (!payload) return [];
  const roleUri = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  const rolesRaw = (payload.role ?? (payload as any)[roleUri]) as string | string[] | undefined;
  if (!rolesRaw) return [];
  return Array.isArray(rolesRaw) ? rolesRaw : [rolesRaw];
}

export function getJwtSubject(token: string): string | null {
  return decodeJwtPayload(token)?.sub ?? null;
}

export function getJwtEmail(token: string): string | null {
  return decodeJwtPayload(token)?.email ?? null;
}

export function getJwtName(token: string): string | null {
  return decodeJwtPayload(token)?.name ?? null;
}

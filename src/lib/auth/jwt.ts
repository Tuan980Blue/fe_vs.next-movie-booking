/**
 * JWT utility functions for token parsing and validation
 */

export interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  role?: string;
  roles?: string[];
  [key: string]: unknown;
}

/**
 * Decode JWT payload without verification (client-side only)
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const json = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  
  const exp = typeof payload.exp === 'number' ? payload.exp : parseInt(payload.exp as string);
  return Date.now() >= exp * 1000;
}

/**
 * Extract user ID from JWT token
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJwtPayload(token);
  return payload?.sub || null;
}

/**
 * Extract roles from JWT token
 */
export function getRolesFromToken(token: string): string[] {
  const payload = decodeJwtPayload(token);
  if (!payload) return [];
  
  // Debug: Log the entire payload to see what claims are available
  console.log('JWT Payload in getRolesFromToken:', payload);
  
  // Check different possible role claim names
  const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string ||
                payload.role as string ||
                payload.roles as string[];
  
  console.log('Role claim found in getRolesFromToken:', roles);
  
  const result = Array.isArray(roles) ? roles : roles ? [roles] : [];
  console.log('Final roles in getRolesFromToken:', result);
  
  return result;
}

/**
 * Check if user has admin role from JWT token
 */
export function isAdminFromToken(token: string): boolean {
  const roles = getRolesFromToken(token);
  return roles.includes('admin') || roles.includes('Admin');
}

/**
 * Get token expiration date
 */
export function getTokenExpiration(token: string): Date | null {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return null;
  
  const exp = typeof payload.exp === 'number' ? payload.exp : parseInt(payload.exp as string);
  return new Date(exp * 1000);
}

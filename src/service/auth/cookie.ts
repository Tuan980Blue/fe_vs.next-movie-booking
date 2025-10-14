// Access token client-side storage helpers
// We intentionally keep the access token in memory and optionally in sessionStorage
// Refresh token stays in HttpOnly cookie managed by the server; we never touch it here.

const ACCESS_TOKEN_KEY = 'access_token';
let inMemoryAccessToken: string | null = null;

export function setAccessToken(token: string | null, persistToSession = true): void {
  inMemoryAccessToken = token;
  try {
    if (persistToSession) {
      if (token) sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
      else sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch {
    // ignore storage errors (e.g., SSR or disabled storage)
  }
}

export function getAccessToken(): string | null {
  if (inMemoryAccessToken) return inMemoryAccessToken;
  try {
    const fromSession = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (fromSession) {
      inMemoryAccessToken = fromSession;
      return fromSession;
    }
  } catch {
    // ignore
  }
  return null;
}

export function clearAccessToken(): void {
  inMemoryAccessToken = null;
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // ignore
  }
}


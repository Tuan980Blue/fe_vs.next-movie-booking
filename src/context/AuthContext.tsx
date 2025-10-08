"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi, registerApi, getMeApi, mapMeResponseToUser, parseUserFromAccessToken } from "@/service/services/authService";
import type { LoginRequest, RegisterRequest, User } from "@/models/user";

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest & { rememberMe?: boolean }) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshFromStorage: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = "access_token";
const ACCESS_TOKEN_EXPIRES_AT_KEY = "access_token_expires_at";
const USER_DATA_KEY = "user_data";

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY) || window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function saveToken(token: string, remember?: boolean, expiresAt?: string) {
  if (typeof window === "undefined") return;
  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(ACCESS_TOKEN_KEY, token);
  if (expiresAt) storage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, expiresAt);
}

function clearStoredAuth() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  window.localStorage.removeItem(USER_DATA_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshFromStorage = useCallback(() => {
    const token = readStoredToken();
    setAccessToken(token);
    if (token) {
      // Prefer parsing from token first for snappy UI, then reconcile with /users/me
      const parsed = parseUserFromAccessToken(token);
      if (parsed) {
        setUser(parsed);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(parsed));
        }
      }
    }
  }, []);

  useEffect(() => {
    // Hydrate on mount
    refreshFromStorage();
    (async () => {
      try {
        const me = await getMeApi().catch(() => null);
        const mapped = mapMeResponseToUser(me);
        if (mapped) setUser(mapped);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshFromStorage]);

  const login = useCallback(async (payload: LoginRequest & { rememberMe?: boolean }) => {
    const data = await loginApi({ email: payload.email, password: payload.password });
    const newToken: string | undefined = data?.accessToken;
    const accessTokenExpiresAt: string | undefined = data?.accessTokenExpiresAt;
    if (!newToken) throw new Error("Login failed: missing access token");
    saveToken(newToken, payload.rememberMe, accessTokenExpiresAt);
    setAccessToken(newToken);
    const parsed = parseUserFromAccessToken(newToken);
    if (parsed) setUser(parsed);
    // Optionally reconcile with /me in background
    getMeApi().then(mapMeResponseToUser).then((u) => u && setUser(u)).catch(() => {});
    // Set a readable cookie flag for middleware to check
    if (typeof document !== "undefined") {
      const maxAge = payload.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 2; // 7 days or 2 hours
      document.cookie = `auth=1; Max-Age=${maxAge}; Path=/`;
      const role = (parsed?.roles?.[0] || "").toLowerCase();
      if (role) document.cookie = `role=${encodeURIComponent(role)}; Max-Age=${maxAge}; Path=/`;
    }
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    await registerApi(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      // Best-effort call; server should clear refresh cookie
      const { default: httpClient } = await import("@/service/api/httpClient");
      const { default: endpoints } = await import("@/service/api/endpoints");
      await httpClient.post(endpoints.auth.logout, {});
    } catch (_) {
      // ignore
    } finally {
      clearStoredAuth();
      setUser(null);
      setAccessToken(null);
      // Clear the readable cookie flag
      if (typeof document !== "undefined") {
        document.cookie = "auth=; Max-Age=0; Path=/";
        document.cookie = "role=; Max-Age=0; Path=/";
      }
      router.push("/");
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    register,
    logout,
    refreshFromStorage,
  }), [user, accessToken, isLoading, login, register, logout, refreshFromStorage]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}



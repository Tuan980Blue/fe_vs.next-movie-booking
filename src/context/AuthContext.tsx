"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {
    loginApi,
    registerApi,
    getMeApi,
    logoutApi,
    parseUserFromAccessToken,
    mapMeResponseToUser
} from "@/service/services/authService";
import type {LoginRequest, RegisterRequest, User} from "@/models/user";
import {
    setAccessTokenCookie,
    getAccessTokenFromCookie,
    setRoleCookie,
    clearAllAuthCookies
} from "@/lib/auth/cookies";
import {isAdminFromToken} from "@/lib/auth/jwt";

type AuthContextValue = {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: LoginRequest & { rememberMe?: boolean }) => Promise<void>;
    register: (payload: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Storage keys
const USER_KEY = 'user';

// Helper functions
const setStoredUser = (user: User | null): void => {
    if (typeof window === 'undefined') return;
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_KEY);
    }
};

const getStoredUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const clearAuthData = (): void => {
    setStoredUser(null);
    clearAllAuthCookies();
};

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check for existing access token
                const token = getAccessTokenFromCookie();

                if (token) {
                    // Then sync with server to get latest user data
                    await syncUserFromServer();
                } else {
                    // No token at all, clear any stale data
                    clearAuthData();
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const syncUserFromServer = async (): Promise<void> => {
        try {
            const userResponse = await getMeApi();
            const userData = mapMeResponseToUser(userResponse);

            if (userData) {
                setUser(userData);
                setStoredUser(userData);

                // Update access token if it was refreshed during the API call
                const currentToken = getAccessTokenFromCookie();
                if (currentToken && currentToken !== accessToken) {
                    setAccessToken(currentToken);
                    console.log('Access token updated after API call');
                }
            }
        } catch (error) {
            console.warn('Failed to sync user from server:', error);
        }
    };

    const refreshUser = useCallback(async (): Promise<void> => {
        await syncUserFromServer();
    }, []);

    const login = useCallback(async (payload: LoginRequest & { rememberMe?: boolean }) => {
        try {
            setIsLoading(true);
            const response = await loginApi(payload);

            if (response?.accessToken) {
                setAccessToken(response.accessToken);
                setAccessTokenCookie(response.accessToken);

                // Try to get user info from API first
                try {
                    const userResponse = await getMeApi();
                    const userData = mapMeResponseToUser(userResponse);
                    if (userData) {
                        setUser(userData);
                        setStoredUser(userData);
                    }
                } catch (error) {
                    console.warn('Failed to fetch user info from API:', error);
                    // Fallback to parsing from token
                    const parsedUser = parseUserFromAccessToken(response.accessToken);
                    if (parsedUser) {
                        setUser(parsedUser);
                        setStoredUser(parsedUser);
                    }
                }

                if (isAdminFromToken(response.accessToken)) {
                    setRoleCookie('admin');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (payload: RegisterRequest) => {
        try {
            setIsLoading(true);
            const response = await registerApi(payload);

            if (response?.accessToken) {
                setAccessToken(response.accessToken);
                setAccessTokenCookie(response.accessToken);

                // Parse user from token (registration usually doesn't have full user data)
                const parsedUser = parseUserFromAccessToken(response.accessToken);
                if (parsedUser) {
                    setUser(parsedUser);
                    setStoredUser(parsedUser);
                }

                if (isAdminFromToken(response.accessToken)) {
                    setRoleCookie('admin');
                }
            }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            await logoutApi();
        } catch (error) {
            console.warn('Logout API failed:', error);
            // Continue with local logout even if API fails
        } finally {
            // Always clear local auth data
            clearAuthData();
            setUser(null);
            setAccessToken(null);
            setIsLoading(false);
        }
    }, []);

    const value = useMemo(() => ({
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    }), [user, accessToken, isLoading, login, register, logout, refreshUser]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}



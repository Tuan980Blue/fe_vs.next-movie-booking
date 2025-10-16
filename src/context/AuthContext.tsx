"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {getMeApi, loginApi, logoutApi, registerApi, mapMeResponseToUser} from "@/service";
import type {User} from "@/models/user";
import {clearAccessToken} from "@/service/auth/cookie";

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export function AuthProvider({children}: { children: React.ReactNode }) {

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    // Initialize auth state on mount
    useEffect(() => {
        // //Check login flag
        // const hasLoggedInFlag = document.cookie.includes('logged_in=true'); //có chứa đoạn văn bản
        // if (!hasLoggedInFlag) {
        //     setIsLoading(false);
        //     return;
        // }

        const initializeAuth = async () => {
            try {
                await syncUserFromServer();
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const syncUserFromServer = async (): Promise<void> => {
        try {
            const me = await getMeApi();
            const mapped = mapMeResponseToUser(me);
            if (mapped) setUser(mapped);
        } catch (error) {
            console.warn('Failed to sync user from server:', error);
            setUser(null);
        }
    };

    const login = async (email: string, password: string): Promise<void> => {
        await loginApi({ email, password });
        // accessToken stored by authService; now fetch user profile
        await syncUserFromServer();
    };

    const register = async (email: string, password: string, fullName: string): Promise<void> => {
        await registerApi({ email, password, fullName });
        await syncUserFromServer();
    };

    const logout = async (): Promise<void> => {
        try {
            await logoutApi();
        } finally {
            clearAccessToken();
            setUser(null);
        }
    };

    const value: AuthContextValue = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshMe: syncUserFromServer,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}



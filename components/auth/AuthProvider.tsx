"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authApi, userApi, getAccessToken, setAccessToken, removeAccessToken, User } from "@/lib/api";

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    googleLogin: (credential: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        const token = getAccessToken();
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const res = await userApi.getProfile();
            if (res.success && res.data?.user) {
                setUser(res.data.user);
            } else {
                setUser(null);
                removeAccessToken();
            }
        } catch {
            setUser(null);
            removeAccessToken();
        }
    }, []);

    useEffect(() => {
        refreshUser().finally(() => setIsLoading(false));
    }, [refreshUser]);

    const login = useCallback(async (email: string, password: string) => {
        const res = await authApi.login(email, password);

        if (res.success && res.data) {
            setAccessToken(res.data.accessToken);
            setUser(res.data.user);
            return { success: true, message: res.message || "Login successful" };
        }

        return { success: false, message: res.message || "Login failed" };
    }, []);

    const googleLogin = useCallback(async (credential: string) => {
        const res = await authApi.googleSignIn({ credential });

        if (res.success && res.data) {
            setAccessToken(res.data.accessToken);
            setUser(res.data.user);
            return { success: true, message: res.message || "Google sign-in successful" };
        }

        return { success: false, message: res.message || "Google sign-in failed" };
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            // clear local state even if server call fails
        }
        removeAccessToken();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                googleLogin,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

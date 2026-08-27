"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { userApi, User } from "@/lib/api";

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetches the app's own profile (firstName/lastName/roles/etc. — richer
    // than Supabase's bare auth user). The backend resolves/JIT-provisions
    // the local user row from the Supabase session itself — see
    // supabaseAuth.service.js — so this is safe to call whenever a session exists.
    const refreshUser = useCallback(async () => {
        try {
            const res = await userApi.getProfile();
            setUser(res.success && res.data?.user ? res.data.user : null);
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const supabase = createClient();
        if (!supabase) {
            Promise.resolve().then(() => setIsLoading(false));
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            (session ? refreshUser() : Promise.resolve(setUser(null))).finally(() => setIsLoading(false));
        });

        // Keep in sync across tabs / background token refresh / sign-out.
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                refreshUser();
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [refreshUser]);

    const logout = useCallback(async () => {
        const supabase = createClient();
        if (!supabase) return;
        await supabase.auth.signOut();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
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

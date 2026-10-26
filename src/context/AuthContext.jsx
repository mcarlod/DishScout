import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore any existing session (Supabase stores it in localStorage)
        supabase.auth.getSession()
            .then(({ data }) => setSession(data.session))
            .catch((err) => {
                // If the stored session can't be read, continue as signed out instead of a blank screen
                console.error("Couldn't restore session:", err);
                setSession(null);
            })
            .finally(() => setLoading(false));

        // Keep session in sync on sign in, sign out, and token refresh
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        session,
        user: session?.user ?? null,
        loading,
        signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
        signUp: (email, password, fullName) =>
            supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName } },
            }),
        signOut: () => supabase.auth.signOut(),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}

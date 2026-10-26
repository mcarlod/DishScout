import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { getProfile } from "../services/profileService";

const ProfileContext = createContext(null);

// Loads the signed-in user's profile once and shares it, so Home and Profile show the name
// straight away instead of fetching it again every time they open
export function ProfileProvider({ children }) {
    const { user } = useAuth();
    const userId = user?.id ?? null;

    // Remember whose profile this is, so a different user never sees the previous user's name
    const [loaded, setLoaded] = useState({ userId: null, profile: null, error: null });
    const request = useRef({ userId: null, promise: null });

    // One request per user; callers that ask while it's in flight share the same promise
    const loadProfile = useCallback((forUserId) => {
        if (request.current.userId !== forUserId || !request.current.promise) {
            request.current = { userId: forUserId, promise: getProfile() };
        }
        return request.current.promise;
    }, []);

    useEffect(() => {
        if (!userId) {
            // Signed out: forget the cached request so the next sign-in fetches fresh data
            request.current = { userId: null, promise: null };
            return;
        }
        let ignore = false;

        loadProfile(userId)
            .then((profile) => {
                if (!ignore) setLoaded({ userId, profile, error: null });
            })
            .catch((err) => {
                console.error("Couldn't load profile:", err);
                if (!ignore) setLoaded({ userId, profile: null, error: err });
                // Allow a fresh attempt next time instead of reusing the failed request
                if (request.current.userId === userId) request.current = { userId: null, promise: null };
            });

        return () => {
            ignore = true;
        };
    }, [userId, loadProfile]);

    // Called after the profile is saved (name or photo) so every page updates at once
    const setProfile = useCallback((profile) => {
        setLoaded((prev) => ({ ...prev, profile, error: null }));
        request.current = { userId: request.current.userId, promise: Promise.resolve(profile) };
    }, []);

    const ready = userId !== null && loaded.userId === userId;

    const value = {
        ready,
        profile: ready ? loaded.profile : null,
        error: ready ? loaded.error : null,
        setProfile,
    };

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile() {
    return useContext(ProfileContext);
}

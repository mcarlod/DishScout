import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";

// Only lets signed-in users through; everyone else goes to the login page.
// Waits for the profile too, so pages never render with the name missing.
export function ProtectedRoute() {
    const { user, loading } = useAuth();
    const { ready: profileReady } = useProfile();
    if (loading) return null;
    if (!user) return <Navigate to="/" replace />;
    if (!profileReady) return null;
    return <Outlet />;
}

// Sends already signed-in users past the login/signup pages. Right after signing in,
// the login page stays up ("Signing in…") until the profile has loaded.
export function PublicOnlyRoute() {
    const { user, loading } = useAuth();
    const { ready: profileReady } = useProfile();
    if (loading) return null;
    if (user && profileReady) return <Navigate to="/home" replace />;
    return <Outlet />;
}

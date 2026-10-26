import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Only lets signed-in users through; everyone else goes to the login page
export function ProtectedRoute() {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? <Outlet /> : <Navigate to="/" replace />;
}

// Sends already signed-in users past the login/signup pages
export function PublicOnlyRoute() {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? <Navigate to="/home" replace /> : <Outlet />;
}

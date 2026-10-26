import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import RecipeDetails from "../pages/RecipeDetails";
import Saved from "../pages/SavedRecipes.jsx";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Layout from "../components/Layout";
import { AuthProvider } from "../context/AuthContext";
import { ProfileProvider } from "../context/ProfileContext";
import { SavedRecipesProvider } from "../context/SavedRecipesContext";
import { ProtectedRoute, PublicOnlyRoute } from "./ProtectedRoute";

export default function AppRouter() {
    return (
        <AuthProvider>
            <ProfileProvider>
                <SavedRecipesProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route element={<PublicOnlyRoute />}>
                                <Route path="/" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                            </Route>

                            <Route element={<ProtectedRoute />}>
                                <Route element={<Layout />}>
                                    <Route path="/home" element={<Home />} />
                                    <Route path="/recipes/:id" element={<RecipeDetails />} />
                                    <Route path="/saved" element={<Saved />} />
                                    <Route path="/profile" element={<Profile />} />
                                    {/* Any other URL; signed-out visitors are sent to login first */}
                                    <Route path="*" element={<NotFound />} />
                                </Route>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </SavedRecipesProvider>
            </ProfileProvider>
        </AuthProvider>
    )
}

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import RecipeDetails from "../pages/RecipeDetails";
import Saved from "../pages/SavedRecipes.jsx";
import Profile from "../pages/Profile";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    )
}